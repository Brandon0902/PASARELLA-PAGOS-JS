const subscriptionService = require('../services/subscriptionService');

const handleWebhook = async (req, res) => {
    const event = req.body;

    try {
        console.log('Evento recibido:', event);

        // Extraer el tipo de evento
        const eventType = event.type;

        switch (eventType) {
            case 'subscription.created':
                const subscriptionCreatedData = {
                    id: event.id,
                    status: event.status,
                    customerId: event.customer_id,
                    subscriptionId: event.id,
                    planId: event.plan_id,
                    trialEnd: event.trial_end,
                    subscriptionStart: event.subscription_start
                };
                await subscriptionService.handleSubscriptionCreated(subscriptionCreatedData);
                break;

            case 'subscription.paid':
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
                await subscriptionService.handleSubscriptionPaid(subscriptionPaidData);
                break;

            case 'charge.declined':
                const chargeDeclinedData = {
                    chargeId: event.charge_id,
                    customerId: event.customer_id,
                    subscriptionId: event.id,
                    reason: event.decline_reason
                };
                await subscriptionService.handleChargeDeclined(chargeDeclinedData);
                break;

            default:
                console.log(`Evento no manejado: ${eventType}`);
        }

        res.status(200).send('Evento recibido y procesado');
    } catch (error) {
        console.error('Error procesando el evento:', error);
        res.status(500).send('Error procesando el evento');
    }
};

module.exports = {
    handleWebhook
};
