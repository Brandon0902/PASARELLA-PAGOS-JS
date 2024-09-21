const PlaneService = require('../services/planeService')
const SubscriptionTypeService = require('../services/subscriptionTypeService')
const SubscriptionRepository = require('../repositories/subscriptionRepository')
const SubscriptionPeriodRespository = require('../repositories/subscriptionPeriodRepository')
const SubscriptionPriceRepository = require('../repositories/subscriptionPriceRepository')
const UserPaymentPlatformRepository = require('../repositories/userPaymentPlatformRepository')
const Mapper = require('../mappers/subscriptionMapper')
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

const saveSubscription = async (plane, subsType, price, userId, result, hasTrialDays) => {
    const t = await sequelize.transaction()

    try {
        
        const subscription = Mapper.toSubscriptionEntity(userId, result, hasTrialDays)
        const subscriptionCreated = await SubscriptionRepository.create(subscription, t)
        subscriptionCreated.subscriptionType = subsType
        
        await SubscriptionPeriodRespository.create(
            Mapper.toSubscriptionPeriodEntity(subscriptionCreated, price, result, hasTrialDays, plane), t
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

    return subscription
}

module.exports = {
    create
}