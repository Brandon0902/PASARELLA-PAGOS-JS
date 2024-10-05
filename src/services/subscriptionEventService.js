const { PaymentPlatform } = require('../models/plane')
const SubscriptionService = require('../services/subscriptionService')
const UserPaymentPlatformRepository = require('../repositories/userPaymentPlatformRepository')
const { NotFoundError } = require('../handlers/errors');
const Mapper = require('../mappers/subscriptionMapper')
const { send } = require('../services/emailService')

const getSubscriptionByCustomerId = async (platform, customerId) => {

    const userData = {
        paymentPlatformId: platform.id,
        referenceId: customerId,
    }

    const userPaymentPlatform = await UserPaymentPlatformRepository.findOne(userData)
    
    if (userPaymentPlatform) {
        return await SubscriptionService.getByUserId(userPaymentPlatform.userId)
    }
    
    return null
}

const getSubscriptionByReferenceId = async (platform, referenceId) => {
    const paymentPlatformId = platform.id
    return await SubscriptionService.getByReferenceId(paymentPlatformId, referenceId)
}

const getUserPaymentPlatform = async (userId, paymentPlatformId) => {
    const result = UserPaymentPlatformRepository.findOne({userId, paymentPlatformId})

    if (result === null) {
        throw new Error('user payment platform not found')
    }

    return result
}

const getSubscription = async (paymentPlatform, event) => {
    const { data } = event;
    const customerId = data.customer_id;
    const subscriptionId = data.subscription_id;

    const platform = await PaymentPlatform.findOne({ where: { name: paymentPlatform } });
    if (!platform) {
        throw new NotFoundError(`Payment platform '${paymentPlatform}' not found`);
    }

    let subscription = null;
    
    if (customerId) {
        subscription = await getSubscriptionByCustomerId(platform, customerId);
    } else {
        subscription = await getSubscriptionByReferenceId(platform, subscriptionId);
    }

    if (!subscription) {
        throw new NotFoundError(`Subscription not found for platform '${paymentPlatform}' with reference ID '${subscriptionId}' or customer ID '${customerId}'`);
    }

    const userData = await getUserPaymentPlatform(subscription.userId, platform.id)

    const user = { id: subscription.userId, email: userData.data.email }

    return Mapper.toSubscription(subscription, user)
}

const suspendSubscription = async (paymentPlatform, event) => { 

    const subscription = await getSubscription(paymentPlatform, event)
    subscription.errors = { ...event.data.errors }

    if (subscription) {
        return await SubscriptionService.suspend(subscription.id, subscription)
    }
}

const subscriptionPaid = async (paymentPlatform, event) => {  
    const subscription = await getSubscription(paymentPlatform, event);

    if (subscription) {
        await SubscriptionService.paid(subscription);
        await send(subscription)
    } 
}

const cancelSubscription = async (paymentPlatform, event) => {

    const subscription = await getSubscription(paymentPlatform, event)

    if (subscription) {
        await SubscriptionService.cancel(subscription)
        await send(subscription)
    }
}

const getStrategy = (eventType) => {
    const strategy = {
        'PAID': execute = async () => subscriptionPaid,
        'CANCEL': execute = async () => cancelSubscription,
        'SUSPEND': execute = async () => suspendSubscription
    }

    return strategy[eventType]
}

const processEvent = async (paymentPlatform, event) => {
    const strategy = getStrategy(event.type)

    const subscription = await getSubscription(paymentPlatform, event)

    if (subscription) {
        await strategy.execute(subscription)
    }
}


module.exports = {
    suspendSubscription,
    cancelSubscription,
    subscriptionPaid,
    processEvent
}