const processEventService = require('../services/processEventService');

const handleWebhook = async (req, res) => {
    const event = req.body;

    try {
        const eventType = event.type;
        await processEventService.executeStrategy(eventType, event);
        res.status(200).send('Evento recibido y procesado');
    } catch (error) {
        console.log(error)
        res.status(400).send(`Error procesando el evento: ${error.message}`);
    }
};

module.exports = {
    handleWebhook,
};
