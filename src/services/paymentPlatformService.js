const { PaymentPlatform, PlanePaymentPlatform } = require('../models');
const conektaService = require('./interfazService');

async function processPaymentPlatforms(customerData, paymentType) {
    try {
        // Obtener todas las plataformas de pago
        const paymentPlatforms = await PlanePaymentPlatform.findAll({
            include: [PaymentPlatform], 
            raw: true
        });

        // Recorrer cada plataforma de pago
        for (let platform of paymentPlatforms) {
            const { platform_payment_id, referend_id } = platform;

            if (platform_payment_id === 1) {
                console.log('Procesando Conekta con referend_id:', referend_id);
                
                await conektaService.processCustomerData(customerData, referend_id, paymentType);

                console.log('Integración con Conekta completada.');
            }
        }
    } catch (error) {
        console.error('Error al procesar las plataformas de pago:', error);
        throw error;
    }
}

module.exports = { processPaymentPlatforms };
