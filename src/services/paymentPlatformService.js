const { PaymentPlatform, PlanePaymentPlatform } = require('../models/plane');
const conektaService = require('./conektaService');
const { NotFoundError, InternalServerError, BadRequestError } = require('../handlers/errors');

const getStrategy = (paymentPlatformName) => {
    const strategies = {
        'CONEKTA': conektaService,
        'STRIPE': { createSubscription: async () => {}, cancelSubscription: async () => {} }
    };

    return strategies[paymentPlatformName];
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
            throw new NotFoundError('No se encontraron plataformas de pago para este plan.');
        }

        for (let platform of paymentPlatforms) {
            const paymentPlatformId = platform.paymentPlatformId;
            const referenceId = platform.referenceId;
            const paymentPlatform = platform.payment_platform;
            const paymentStrategy = getStrategy(paymentPlatform.name);

            try {
                const { customerId, subscriptionId } = await paymentStrategy.createSubscription(customerData, referenceId, paymentType);
                
                return {
                    customerId,
                    subscriptionId,
                    id: paymentPlatformId
                };
            } catch (error) {
                if (paymentPlatform.name === 'CONEKTA' && error.details && Array.isArray(error.details)) {
                    throw new BadRequestError(error.details[0]?.message, error.details);
                }

                throw new InternalServerError(`Error en la plataforma ${paymentPlatform.name}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error('Error en el procesamiento de plataformas de pago:', error.message);
        throw error;
    }
}

const cancelSubscription = async (subscription) => {
    try {
        const referenceData = subscription.referenceData;
        const paymentStrategy = getStrategy(subscription.paymentPlatformName);

        const result = await paymentStrategy.cancelSubscription(referenceData);
        return result !== null;
    } catch (err) {
        console.error('Error al cancelar la suscripción:', err.message);
        return false;
    }
}

module.exports = {
    processPaymentPlatforms,
    cancelSubscription
}