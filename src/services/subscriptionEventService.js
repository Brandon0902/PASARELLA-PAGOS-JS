const { PaymentPlatform } = require('../models/plane')
const SubscriptionService = require('../services/subscriptionService')
const UserPaymentPlatformRepository = require('../repositories/userPaymentPlatformRepository')

const getSubscriptionByCustomerId = async (platform, customerId) => {

    const userData = {
        paymentPlatformId: platform.id,
        referenceId: customerId,
    }

    const userPaymentPlatform = await UserPaymentPlatformRepository.findOne(userData)
    
    if (userPaymentPlatform)
        return await SubscriptionService.getByUserId(userPaymentPlatform.userId)
    
    return null
}

const getSubscriptionByReferenceId = async (platform, referenceId) => {
    const paymentPlatformId = platform.id
    return await SubscriptionService.getByReferenceId(paymentPlatformId, referenceId)
}

const getSubscription = async (paymentPlatform, event) => {
    const { data } = event;
    const customerId = data.customer_id;
    const subscriptionId = data.subscription_id;
    const platform = await PaymentPlatform.findOne({ where: { name: paymentPlatform } });

    let subscription = null;
    if (customerId) {
        subscription = await getSubscriptionByCustomerId(platform, customerId);
    } else {
        subscription = await getSubscriptionByReferenceId(platform, subscriptionId);
    }

    if (!subscription) {
        return null;
    }

    const { errors } = data;

    const subscriptionData = {
        id: subscription.id,
        userId: subscription.userId,
        endDate: subscription.endDate,
        errors: { ...errors },
        paymentPlatformId: subscription.paymentPlatformId,
        referenceId: subscription.referenceId
    };

    return subscriptionData;
}

const suspendSubscription = async (paymentPlatform, event) => { 

    const subscription = await getSubscription(paymentPlatform, event)

    if (subscription)
        return await SubscriptionService.suspend(subscription.id, subscription)
}

const subscriptionPaid = async (paymentPlatform, event) => { 
    const subscription = await getSubscription(paymentPlatform, event);

    if (subscription) {
        return await SubscriptionService.paid(subscription.paymentPlatformId, subscription.referenceId);
    } 
}

const cancelSubscription = async (paymentPlatform, event) => {

    const subscription = await getSubscription(paymentPlatform, event)

    if (subscription)
        return await SubscriptionService.cancel(subscription)
}


module.exports = {
    suspendSubscription,
    cancelSubscription,
    subscriptionPaid
}