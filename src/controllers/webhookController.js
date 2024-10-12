const processEventService = require('../services/processEventService');

const handleWebhook = async (req, res) => {
    const event = req.body;

    try {
        const eventType = event.type;

        // Verificar si eventType está definido
        if (!eventType) {
            return res.status(400).send('Error: El tipo de evento es obligatorio');
        }

        await processEventService.executeStrategy(eventType, event);
        res.status(200).send('Evento recibido y procesado');
    } catch (error) {
        res.status(400).send(`Error procesando el evento: ${error.message}`);
    }
};

module.exports = {
    handleWebhook,
};
