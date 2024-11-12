const { conektaClient } = require('../services/httpService');

async function createSubscription(customerData, planId, paymentType) {
    const conektaSubscription = {
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        plan_id: planId,
        payment_sources: [
            {
                type: 'card',
                token_id: customerData.token_id
            }
        ]
    };

    try {
        const response = await conektaClient.post('/customers', conektaSubscription);

        return {
            customerId: response.data.id,
            subscriptionId: response.data.subscription.id
        };
    } catch (error) {
        if (error.response && error.response.data && error.response.data.details) {
            const conektaErrorDetails = error.response.data.details.map(detail => ({
                message: detail.message,
                param: detail.param,
                code: detail.code
            }));

            console.error('Error de Conekta:', conektaErrorDetails);

            const conektaError = new Error('Error en la plataforma Conekta');
            conektaError.details = conektaErrorDetails;
            conektaError.status = 422; 

            throw conektaError;
        }

        console.error('Error al crear cliente y suscripción:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const cancelSusbcription = async (subscription) => {
    const { customerId } = subscription;
    return await conektaClient.post(`/customers/${customerId}/subscription/cancel`);
}

module.exports = { createSubscription, cancelSusbcription };