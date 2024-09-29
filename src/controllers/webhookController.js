const processEventService = require('../services/processEventService');

const processSubscriptionPaid = async (event) => {
    const subscriptionPaidData = {
        id: event.id,
        status: event.status,
        chargeId: event.charge_id,
        customerId: event.customer_id,
        billingCycleStart: event.billing_cycle_start,
        billingCycleEnd: event.billing_cycle_end,
        subscriptionStart: event.subscription_start,
        lastBillingCycleOrderId: event.last_billing_cycle_order_id
    };

    // Llamada al servicio para manejar el pago de suscripción
    await processEventService.handleSubscriptionPaid(subscriptionPaidData);
};

const processChargeDeclined = async (event) => {
    const chargeDeclinedData = {
        chargeId: event.charge_id,
        customerId: event.customer_id,
        subscriptionId: event.id,
        reason: event.decline_reason
    };

    // Llamada al servicio para manejar el rechazo del cargo
    await processEventService.handleChargeDeclined(chargeDeclinedData);
};

// Mapa de funciones por tipo de evento
const eventHandlers = {
    'subscription.paid': processSubscriptionPaid,
    'charge.declined': processChargeDeclined
};


const handleWebhook = async (req, res, next) => {
    const event = req.body;

    try {
        // Obtener el tipo de evento
        const eventType = event.type;

        const eventHandler = eventHandlers[eventType];

        if (eventHandler) {
            await eventHandler(event);
            res.status(200).send('Evento recibido y procesado');
        } else {
            res.status(400).send(`Evento no manejado: ${eventType}`);
        }
    } catch (error) {
        res.status(500).send('Error procesando el evento');
    }
};

module.exports = {
    handleWebhook
};
