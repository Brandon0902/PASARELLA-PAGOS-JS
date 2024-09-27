const conektaDevCenter = require('@api/conekta-dev-center');


conektaDevCenter.api_key = process.env.CONEKTA_API_KEY;
conektaDevCenter.api_version = '2.1.0';

function processCustomerData(customerData, planId, paymentType) {
    const conektaSuscription = {
        email: customerData.email, 
        name: customerData.name,   
        phone: customerData.phone,
        payment_sources: [         
            {
                type: paymentType || 'card',
                token_id: customerData.token_id  
            }
        ],
        subscription: {            
            plan_id: planId,
        }
    };

    return conektaDevCenter.createCustomer(conektaSuscription, { 'Accept-Language': 'es' })
    .then(({ data }) => {
        console.log('Cliente creado exitosamente:', data);
        return data; 
    })
    .catch(err => {
        console.error('Error al crear cliente:', err);
        throw err;  
    });
}

module.exports = { processCustomerData };
