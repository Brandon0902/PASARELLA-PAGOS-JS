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

        await UserPaymentPlatformRepository.create(Mapper.toUserPaymentPlatformEntity(result.id, user, result), t)

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

const updateCurrentSubscriptionPeriod = async (subscriptionId, data, tx) => {
    const period = await getPeriodBySubscriptionId(subscriptionId)

    const periodData = Mapper.toSubscriptionPeriodEntity1(period, data)

    const [count, [updated]] = await SubscriptionPeriodRespository.update(period.id, periodData, tx)

    if (count === 0) {
        throw new InternalServerError(`error to trying update period ${data} subscription ${subscriptionId}`)
    }

    return updated
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
        const { id } = subscription;

        const subscriptionData = Mapper.toCancelSubscriptionEntity();
        const [_, [updated]] = await SubscriptionRepository.update(id, subscriptionData, t);

        const periodData = Mapper.toEndedSubscriptionPeriodEntity();
        await updateCurrentSubscriptionPeriod(id, periodData, t);

        const isCanceled = await PaymentPlatformService.cancelSubscription(subscription);

        if (!isCanceled) {
            throw new InternalServerError('Error trying to cancel subscription. Please retry later');
        }

        return updated;
    }, subscription);
}

const create = async (data) => {
    const user = data.user;
    const plane = await PlaneService.getById(data.subscriptionRequest.plane_id);
    const subsType = await getSubscriptionType(data.subscriptionRequest.subscription_type_id);
    const price = await getPlanePrice(plane.id, subsType.id);
    const hasTrialDays = await applyFreeTrial(user.id);

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
    const { id, user } = data;

    const subscription = await getSubscription(id, user.id);

    if (!subscription) {
        throw new NotFoundError('Subscription not found');
    }

    return await cancelSubscription(subscription);
}

const getByReferenceId = async (paymentPlatformId, referenceId) => {
    return await SubscriptionRepository.findOne({ paymentPlatformId, referenceId })
}

const getPeriodBySubscriptionId = async (id) => {
    const period = await SubscriptionPeriodRespository.findOne({
        subscriptionId: id,
        state: { [Op.in]: ['ACTIVE', 'PENDING', 'ERROR'] }
    })

    if (period === null) {
        throw new NotFoundError(`not exists current period for subscription ${id}`)
    }

    return period
}

const suspendSubscription = async (subscription) => {

    return executeTransaction(async (subscription, tx) => {
        
        const { id } = subscription
        const data = Mapper.toSubscriptionEntity1(subscription, 'SUSPENDED')

        const updated = SubscriptionRepository.update(id, data, tx)

        const { errors } = subscription
        const periodData = { 
            state: 'ERROR',
            errorDetails: {error: errors}
        }
        await updateCurrentSubscriptionPeriod(id, periodData, tx)

        return updated

    }, subscription)
}

const suspend = async (id, data = null) => {
    return await suspendSubscription({id, ...data})
}

const getActiveSubscription = async (userId) => {
    const subscription = await getByUserId(userId);

    if (!subscription) {
        throw new NotFoundError('No active subscription found');
    }

    const subscriptionPeriod = await getPeriodBySubscriptionId(subscription.id);

    if (!subscriptionPeriod || subscriptionPeriod.state !== 'ACTIVE') {
        throw new NotFoundError('No active subscription period found');
    }

    const plane = await PlaneService.getById(subscriptionPeriod.planeId);
    const subscriptionType = await getSubscriptionType(subscriptionPeriod.subscriptionTypeId);

    return [{
        id: subscription.id,
        userId: subscription.userId,
        planeName: plane.name,
        subscriptionType: subscriptionType.code,
        startDate: subscriptionPeriod.startDate,
        endDate: subscriptionPeriod.endDate,
        renewDate: subscriptionPeriod.endDate,
        state: subscription.state
    }];
}

const updateSubscription = async (id, data) => {
    const [ count , result ] = await SubscriptionRepository.update(id, data);
    
    if (count === 0) {
        throw new InternalServerError(`error to trying update ${data} of subscription ${id}`)
    }

    return result[0]
}

const paid = async (subscription) => {
    try {
        
        let subscriptionUpdated = null
        let lastPeriod = null

        if (subscription.state === 'PENDING') {
            subscriptionUpdated = await updateSubscription(subscription.id, {state: 'ACTIVE'})
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

        const currentSubscription = subscriptionUpdated || subscription

        return Mapper.toSubscription(currentSubscription, subscription.user, lastPeriod); // Hay un problema con las que se actualizan a active

    } catch (error) {
        throw new InternalServerError(`Error processing subscription ${subscription.id}: ${error.message}`);
    }
};


module.exports = {
    create,
    cancel,
    suspend,
    getByUserId,
    getByReferenceId,
    paid,
    getActiveSubscription 
}