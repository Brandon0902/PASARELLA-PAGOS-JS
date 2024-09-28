const { PaymentPlatform, PlanePaymentPlatform } = require('../models/plane');
const conektaService = require('./interfazService');

async function processPaymentPlatforms(customerData, paymentType) {
    const { planeId, subscriptionTypeId } = customerData; 

    try {
        // Obtener plataformas de pago filtradas por plane_id y subscription_type_id
        const paymentPlatform = await PlanePaymentPlatform.findAll({
            where: {
                plane_id: planeId,  
                subscription_type_id: subscriptionTypeId
            },
            include: [{
                model: PaymentPlatform,
                attributes: ['id', 'name', 'state', 'created_at']
            }]
        });

        // Recorrer cada plataforma de pago
        for (let platform of paymentPlatform) {
            const paymentPlatformId = platform.payment_platform_id; 
            const referenceId = platform.reference_id;

            if (paymentPlatformId === 1) {
                console.log('Procesando Conekta con referenceId:', referenceId);
                
                await conektaService.processCustomerData(customerData, referenceId, paymentType);

                console.log('Integración con Conekta completada.');
            }
        }
    } catch (error) {
        console.error('Error al procesar las plataformas de pago:', error);
        throw error;
    }
}

module.exports = { processPaymentPlatforms };
