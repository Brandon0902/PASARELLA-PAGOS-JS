const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const { checkApiKey } = require('../middlewares/auth')

router.post('/webhook', checkApiKey, webhookController.handleWebhook);

module.exports = router;
