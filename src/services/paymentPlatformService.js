const { PaymentPlatform, PlanePaymentPlatform } = require('../models/plane');
const conektaService = require('./conektaService');
const { NotFoundError, InternalServerError } = require('../handlers/errors');

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

        if (paymentPlatforms.length === 0) {
            throw new NotFoundError('Error al procesar las plataformas de pago');
        }

        for (let platform of paymentPlatforms) {
            const paymentPlatformId = platform.paymentPlatformId;
            const referenceId = platform.referenceId;
            const paymentPlatform = platform.payment_platform;
            const paymentStrategy = getStrategy(paymentPlatform.name);

            try {
                const { customerId, subscriptionId } = await paymentStrategy.createSubscription(customerData, referenceId, paymentType);
                console.log('Integración con Conekta completada.');

                return {
                    customerId,
                    subscriptionId,
                    id: paymentPlatformId
                };
            } catch (error) {
                console.error('Error en la integración con Conekta:', error.message);
                throw new InternalServerError('No se pudo completar la suscripción con la plataforma de pago Conekta');
            }
        }

    } catch (error) {
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
