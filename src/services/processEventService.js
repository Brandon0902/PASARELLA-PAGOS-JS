const handleSubscriptionPaid = async (subscriptionPaidData) => {
    
};

const handleChargeDeclined = async (chargeDeclinedData) => {

};


const strategies = {
    'subscription.paid': handleSubscriptionPaid,
    'charge.declined': handleChargeDeclined,
};

const executeStrategy = async (eventType, data) => {
    const strategy = strategies[eventType];
    if (!strategy) {
        throw new Error(`Estrategia no encontrada para el evento: ${eventType}`);
    }
    return await strategy(data);
};

module.exports = {
    executeStrategy,
};
