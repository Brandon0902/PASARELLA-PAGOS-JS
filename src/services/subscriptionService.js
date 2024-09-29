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

const getSubscriptionType = async (id) => {
    return await SubscriptionTypeService.getById(id)
}

const getPlanePrice = async (plane, subsType) => {
    return await SubscriptionPriceRepository.findByPlaneAndSubscriptionType(plane, subsType)
}

const saveSubscription = async (plane, subsType, price, userId, result, hasTrialDays) => {
    const t = await sequelize.transaction()

    try {
        
        const subscription = Mapper.toSubscriptionEntity(userId, result, hasTrialDays)
        const subscriptionCreated = await SubscriptionRepository.create(subscription, t)
        subscriptionCreated.subscriptionType = subsType
        
        await SubscriptionPeriodRespository.create(
            Mapper.toSubscriptionPeriodEntity(subscriptionCreated, price, hasTrialDays, plane), t
        )

        await UserPaymentPlatformRepository.create(Mapper.toUserPaymentPlatformEntity(1, userId, result), t)

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

    if (subscription === null)
        throw new NotFoundError('subscription not found')

    const paymentPlatformId = subscription.paymentPlatformId
    const userPayPlatform = await UserPaymentPlatformRepository.findOne({ userId, paymentPlatformId })

    if (userPayPlatform === null)
        throw new NotFoundError('user payment platform not found')

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

const cancelSubscription = async (subscription) => {

    try {

        const result = await sequelize.transaction(async t => {

            const { id } = subscription

            const subscriptionData = Mapper.toCancelSubscriptionEntity()
            const [ _, [updated]] = await SubscriptionRepository.update(id, subscriptionData, t)

            const periodData = Mapper.toEndedSubscriptionPeriodEntity()
            await SubscriptionPeriodRespository.update(id, periodData, t)

            // Cancel subscription on payment platform
            const isCanceled = await PaymentPlatformService.cancelSubscription(subscription)

            if(!isCanceled)
                throw new InternalServerError('error to trying cancel subscription. Retry later')

            return updated
        })

        return result

    } catch(err) {
        console.log(err)
        throw err
    }
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

    return await saveSubscription(plane, subsType, price, user.id, result, hasTrialDays)
}

const cancel = async (data) => {
    const { id, user } = data

    // Get subscription by id and user id. Only cancel if user subscription

    const subscription = await getSubscription(id, user.id)

    // Finish subscription and subscription period
    return await cancelSubscription(subscription)
}

module.exports = {
    create,
    cancel
}