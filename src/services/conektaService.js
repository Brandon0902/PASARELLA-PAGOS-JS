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
        console.error('Error al crear cliente y suscripción:', error.response ? error.response.data : error.message);
        throw error;
    }
}

const cancelSusbcription = async (subscription) => {
    const { customerId } = subscription;
    return await conektaClient.post(`/customers/${customerId}/subscription/cancel`);
}

module.exports = { createSubscription, cancelSusbcription };
