const SubscriptionEventService = require('../services/subscriptionEventService')

const handleSubscriptionPaid = async (paymentPlatform, subscriptionPaidData) => {
    const { object } = subscriptionPaidData;
    const event = {
        data: {
            subscription_id: object.id
        }
    };
    return await SubscriptionEventService.subscriptionPaid(paymentPlatform, event);
}

const handleChargeDeclined = async (paymentPlatform, eventData) => {
    
    const {failure_code, failure_message} = eventData.data.object
    const event = {
        data: {
            customer_id: eventData.data.object.customer_id,
            errors: { failure_code, failure_message }
        }
    }
    return await SubscriptionEventService.suspendSubscription(paymentPlatform, event)
}

const handleSubscriptionCanceled = async (paymentPlatform, eventData) => {
    const event = {
        data: {
            subscription_id: eventData.object.id
        }
    }
    return await SubscriptionEventService.cancelSubscription(paymentPlatform, event)
}

const getPaymentPlatform = (eventType) => {
    const conektaEvents = [
        'subscription.paid',
        'charge.declined',
        'subscription.canceled'
    ]

    const isConekta = conektaEvents.includes(eventType)

    if(isConekta)
        return 'CONEKTA'
    
    return 'UNKNOWN'
}


const strategies = {
    'subscription.paid': handleSubscriptionPaid,
    'charge.declined': handleChargeDeclined,
    'subscription.canceled': handleSubscriptionCanceled
};

const executeStrategy = async (eventType, data) => {
    const strategy = strategies[eventType];
    if (!strategy) {
        throw new Error(`Estrategia no encontrada para el evento: ${eventType}`);
    }

    const paymentPlatform = getPaymentPlatform(eventType)

    return await strategy(paymentPlatform, data);
};

module.exports = {
    executeStrategy,
};