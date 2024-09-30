const { PaymentPlatform, PlanePaymentPlatform } = require('../models/plane');
const conektaService = require('./conektaService');

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

            if (paymentPlatformId === 1) {
                console.log('Procesando Conekta con referenceId:', referenceId);

                // Llamar a createSubscription y capturar los valores
                const { customerId, subscriptionId } = await conektaService.createSubscription(customerData, referenceId, paymentType);

                console.log('Integración con Conekta completada.');

                return {
                    customerId,
                    subscriptionId,
                    id: paymentPlatformId
                };
            }
        }

    } catch (error) {
        console.error('Error al procesar las plataformas de pago:', error);
        throw error;
    }
}

module.exports = { processPaymentPlatforms };
