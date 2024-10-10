const PlaneService = require('../services/planeService')
const SubscriptionTypeService = require('../services/subscriptionTypeService')
const PaymentPlatformService = require('../services/paymentPlatformService')
const SubscriptionRepository = require('../repositories/subscriptionRepository')
const SubscriptionPeriodRespository = require('../repositories/subscriptionPeriodRepository')
const SubscriptionPriceRepository = require('../repositories/subscriptionPriceRepository')
const UserPaymentPlatformRepository = require('../repositories/userPaymentPlatformRepository')
const Mapper = require('../mappers/subscriptionMapper')
const { sequelize } = require('../config/database')
const { NotFoundError, InternalServerError } = require('../handlers/errors')
const { Op } = require('sequelize')
const { send } = require('../services/emailService')

const getSubscriptionType = async (id) => {
    return await SubscriptionTypeService.getById(id)
}

const getPlanePrice = async (plane, subsType) => {
    return await SubscriptionPriceRepository.findByPlaneAndSubscriptionType(plane, subsType)
}

const saveSubscription = async (plane, subsType, price, user, result, hasTrialDays) => {
    const t = await sequelize.transaction()

    try {
        
        const subscription = Mapper.toSubscriptionEntity(user.id, result, hasTrialDays)
        const subscriptionCreated = await SubscriptionRepository.create(subscription, t)

        const period = await SubscriptionPeriodRespository.create(
            Mapper.toSubscriptionPeriodEntity(subscriptionCreated, subsType, price, hasTrialDays, plane), t
        )

        subscriptionCreated.lastPeriod = period

        await UserPaymentPlatformRepository.create(Mapper.toUserPaymentPlatformEntity(1, user, result), t)

        await t.commit()

        return subscriptionCreated
    } catch(err) {
        console.log(err)
        t.rollback()
        throw err
    }
}

const getByUserId = async (userId) => {
    return await SubscriptionRepository.findByUserId(userId)
}

const applyFreeTrial = async (userId) => {
    return await getByUserId(userId) === null
}

const getSubscription = async (id, userId) => {
    const subscription = await SubscriptionRepository.findByIdAndUserId(id, userId)

    if (subscription === null) {
        throw new NotFoundError('subscription not found')
    }

    const paymentPlatformId = subscription.paymentPlatformId
    const userPayPlatform = await UserPaymentPlatformRepository.findOne({ userId, paymentPlatformId })

    if (userPayPlatform === null) {
        throw new NotFoundError('user payment platform not found')
    }

    const subscriptionData = {
        id: subscription.id,
        paymentPlatformId: userPayPlatform.payment_platform.id,
        paymentPlatformName: userPayPlatform.payment_platform.name,
        referenceData: {
            customerId: userPayPlatform.referenceId,
            subscriptionId: subscription.referenceId
        }
    }

    return subscriptionData
}

const executeTransaction = async (func, data) => {
    try {
        
        const result = await sequelize.transaction(async t => {
            return await func(data, t)
        })
    
        return result

    } catch(err) {
        console.log(err)
        throw err
    }
}

const cancelSubscription = async (subscription) => {

    return executeTransaction(async (subscription, t) => {

        const { id } = subscription

        const subscriptionData = Mapper.toCancelSubscriptionEntity()
        const [ _, [updated]] = await SubscriptionRepository.update(id, subscriptionData, t)

        const periodData = Mapper.toEndedSubscriptionPeriodEntity()
        await SubscriptionPeriodRespository.update(id, periodData, t)

        // Cancel subscription on payment platform
        const isCanceled = await PaymentPlatformService.cancelSubscription(subscription)

        if(!isCanceled) {
            throw new InternalServerError('error to trying cancel subscription. Retry later')
        }

        return updated
    }, subscription)
}

const create = async (data) => {
    const user = data.user
    const plane = await PlaneService.getById(data.subscriptionRequest.plane_id);
    const subsType = await getSubscriptionType(data.subscriptionRequest.subscription_type_id);
    const price = await getPlanePrice(plane.id, subsType.id)

    // Value to create trial period
    const hasTrialDays = await applyFreeTrial(user.id)

    // Get payment platform strategy
    const userData = {
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        phone: user.phone,
        token_id: data.subscriptionRequest.token_id,
        planeId: plane.id,
        subscriptionTypeId: subsType.id
    }
    const result = await PaymentPlatformService.processPaymentPlatforms(userData)

    const subscription = await saveSubscription(plane, subsType, price, user, result, hasTrialDays)

    if (subscription.state === 'ACTIVE') {
        await send(await Mapper.toSubscription(subscription, user))
    }

    return subscription
}

const cancel = async (data) => {
    const { id, user } = data

    // Get subscription by id and user id. Only cancel if user subscription

    const subscription = await getSubscription(id, user.id)

    // Finish subscription and subscription period
    return await cancelSubscription(subscription)
}

const getByReferenceId = async (paymentPlatformId, referenceId) => {
    return await SubscriptionRepository.findOne({ paymentPlatformId, referenceId })
}

const getPeriodBySubscriptionId = async (id) => {
    return await SubscriptionPeriodRespository.findOne({
        subscriptionId: id,
        state: { [Op.in]: ['ACTIVE', 'PENDING', 'ERROR'] }
    })
}

const suspendSubscription = async (subscription) => {

    return executeTransaction(async (subscription, tx) => {
        
        const { id } = subscription
        const data = Mapper.toSubscriptionEntity1(subscription, 'SUSPENDED')

        const updated = SubscriptionRepository.update(id, data, tx)

        const period = await getPeriodBySubscriptionId(id)

        const periodData = Mapper.toSubscriptionPeriodEntity1(
            period,
            'ERROR',
            { error: { ...errors } = subscription}
        )

        await SubscriptionPeriodRespository.update(period.id, periodData, tx)

        return updated

    }, subscription)
}

const suspend = async (id, data = null) => {
    return await suspendSubscription({id, ...data})
}

const paid = async (subscription) => {
    try {
        
        let lastPeriod = null

        if (subscription.state === 'PENDING') {
            await SubscriptionRepository.update(subscription.id, { state: 'ACTIVE' });
            subscription.state = 'ACTIVE';
        }

        const currentPeriod = await getPeriodBySubscriptionId(subscription.id);

        const subscriptionType = await getSubscriptionType(currentPeriod.subscriptionTypeId);

        if (currentPeriod.state === 'PENDING') {
            await SubscriptionPeriodRespository.update(
                currentPeriod.id,
                { state: 'ACTIVE' }
            );
        } else if (currentPeriod.state === 'ACTIVE') {
            await SubscriptionPeriodRespository.update(
                currentPeriod.id,
                { state: 'ENDED' }
            );

            const newPeriod = Mapper.toNextSubscriptionPeriodEntity(
                subscription,
                currentPeriod,
                subscriptionType
            );
            lastPeriod = await SubscriptionPeriodRespository.create(newPeriod);
        }

        return Mapper.toSubscription(subscription, subscription.user, lastPeriod);

    } catch (error) {
        throw new InternalServerError(`Error processing subscription: ${error.message}`);
    }
};


module.exports = {
    create,
    cancel,
    suspend,
    getByUserId,
    getByReferenceId,
    paid
}