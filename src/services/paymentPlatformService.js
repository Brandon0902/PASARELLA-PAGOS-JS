const { PaymentPlatform, PlanePaymentPlatform } = require('../models/plane');
const conektaService = require('./conektaService');

const getStrategy = (paymentPlatformName) => {
    
    const strategies = {
        'CONEKTA': conektaService,
        'STRIPE': { createSubscription: async () => {}, cancelSubscription: async () => {}}
    }

    return strategies[paymentPlatformName]
}

async function processPaymentPlatforms(customerData, paymentType) {
    const { planeId, subscriptionTypeId } = customerData; 

    try {
        // Obtener plataformas de pago filtradas por planeId y subscriptionTypeId
        const paymentPlatforms = await PlanePaymentPlatform.findAll({
            where: {
                planeId,
                subscriptionTypeId
            },
            include: [{
                model: PaymentPlatform,
                attributes: ['id', 'name', 'state', 'createdAt']
            }]
        });

        // Recorrer cada plataforma de pago
        for (let platform of paymentPlatforms) {
            const paymentPlatformId = platform.paymentPlatformId; 
            const referenceId = platform.referenceId;
            const paymentPlatform = platform.payment_platform

            console.log('Procesando Conekta con referenceId:', referenceId);
            const paymentStrategy = getStrategy(paymentPlatform.name)
            // Llamar a createSubscription y capturar los valores
            const { customerId, subscriptionId } = await paymentStrategy.createSubscription(customerData, referenceId, paymentType);

            console.log('Integración con Conekta completada.');

            return {
                customerId,
                subscriptionId,
                id: paymentPlatformId
            };
        }

    } catch (error) {
        console.error('Error al procesar las plataformas de pago:', error);
        throw error;
    }
}

const cancelSubscription = async (subscription) => {
    try {

        const referenceData = subscription.referenceData

        const paymentStrategy = getStrategy(subscription.paymentPlatformName)

        const result = await paymentStrategy.cancelSusbcription(referenceData)
        return result !== null
    } catch(err) {
        console.log(err)
        return false
    }
}

module.exports = { 
    processPaymentPlatforms,
    cancelSubscription
};
