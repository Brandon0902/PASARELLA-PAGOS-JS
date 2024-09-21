const { PaymentPlatform, PlanePaymentPlatform } = require('../models');
const conektaService = require('./interfazService');

// Función para procesar plataformas de pago
async function processPaymentPlatforms(customerData, paymentType) {
    try {
        // Obtener todas las plataformas de pago
        const paymentPlatforms = await PlanePaymentPlatform.findAll({
            include: [PaymentPlatform], 
            raw: true
        });

        for (let platform of paymentPlatforms) {
            const { platform_payment_id, referend_id } = platform;

            // Si la plataforma es Conekta (id 1)
            if (platform_payment_id === 1) {
                console.log('Procesando Conekta con referend_id:', referend_id);
                
                // Toma el referend_id como el plan_id para la integración con Conekta
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
