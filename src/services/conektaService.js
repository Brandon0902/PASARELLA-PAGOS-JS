const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const CONEKTA_API_KEY = process.env.CONEKTA_API_KEY;

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
        const response = await axios.post('https://api.conekta.io/customers', conektaSubscription, {
            headers: {
                'Accept': 'application/vnd.conekta-v2.1.0+json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONEKTA_API_KEY}`
            }
        });

        return {
            customerId: response.data.id,
            subscriptionId: response.data.subscription.id
        };
    } catch (error) {
        console.error('Error al crear cliente y suscripción:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { createSubscription };
