const PlaneService = require('../services/planeService')
const SubscriptionTypeService = require('../services/subscriptionTypeService')
const SubscriptionRepository = require('../repositories/subscriptionRepository')
const SubscriptionPeriodRespository = require('../repositories/subscriptionPeriodRepository')
const SubscriptionPriceRepository = require('../repositories/subscriptionPriceRepository')
const UserPaymentPlatformRepository = require('../repositories/userPaymentPlatformRepository')
const { sequelize } = require('../config/database')

const getSubscriptionType = async (id) => {
    return await SubscriptionTypeService.getById(id)
}

const getPlanePrice = async (plane, subsType) => {
    return await SubscriptionPriceRepository.findByPlaneAndSubscriptionType(plane, subsType)
}

const getPaymentStrategy = (id) => {
    return {
        createSubscription: (data, hasTrialDays) => {
            return {
                id: 1,
                customerId: 'cus_4124124124124',
                subscriptionId: 'subs_4124214124'
            }
        }
    }
}

const buildSubscription = (plane, subsType, userId, paymentData, hasTrialDays) => {
    return {
        userId: userId,
        planeId: plane.id,
        subscriptionTypeId: subsType.id,
        paymentMethodId: 1,
        paymentPlatformId: paymentData.id,
        hasTrialDays: hasTrialDays,
        state: hasTrialDays ? 'ACTIVE' : 'PENDING'
    }
}

const calculateEndDate = (subscriptioType) => {
    switch(subscriptioType) {
        case 'MONTHLY': return new Date()
        case 'YEARLY': return new Date()
    }

    return ''
}

const buildPeriod = (subscription, prices, paymentResult) => {
    return {
        subscriptionId: subscription.id,
        price: prices.price,
        referenceId: paymentResult.subscriptionId,
        state: 'ACTIVE',
        startDate: new Date(),
        endDate: calculateEndDate(subscription.subscriptionType.code)
    }
}

const buildUserPaymentPlatform = (paymentPlatformId, userId, paymentData) => {
    return {
        userId,
        paymentPlatformId,
        referenceId: paymentData.customerId,
        state: 'ACTIVE'
    }
}

const saveSubscription = async (plane, subsType, price, userId, result, hasTrialDays) => {
    const t = await sequelize.transaction()

    try {
        
        const subscription = buildSubscription(plane, subsType, userId, result, hasTrialDays)
        const subscriptionCreated = await SubscriptionRepository.create(subscription, t)
        subscriptionCreated.subscriptionType = subsType
        
        await SubscriptionPeriodRespository.create(buildPeriod(subscriptionCreated, price, result), t)

        await UserPaymentPlatformRepository.create(buildUserPaymentPlatform(1, userId, result), t)

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

const create = async (data) => {
    const user = data.user
    const plane = await PlaneService.getById(data.subscriptionRequest.plane_id);
    const subsType = await getSubscriptionType(data.subscriptionRequest.subscription_type_id);
    const price = await getPlanePrice(plane.id, subsType.id)

    // Value to create trial period
    const hasTrialDays = await applyFreeTrial(user.userId)

    // Get payment platform strategy
    const strategy = getPaymentStrategy() // PaymentPlatformService.createCharge(data)
    const result = strategy.createSubscription(data, hasTrialDays)

    const subscription = await saveSubscription(plane, subsType, price, user.userId, result, hasTrialDays)

    // Send email
    // sendEmail()

    return subscription
}

module.exports = {
    create
}