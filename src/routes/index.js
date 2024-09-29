const express = require('express');
const router = express.Router();

const PlaneController = require('../controllers/planeController')
const SubscriptionController = require('../controllers/subscriptionController')
const { checkAuthToken } = require('../middlewares/auth')

router.get('/planes', PlaneController.getAll)

router.post('/subscriptions', checkAuthToken, SubscriptionController.create)
router.post('/subscriptions/:id/cancel', checkAuthToken, SubscriptionController.cancel)

router.get('/', (req, res, next) => {
  res.json({ message: 'Hello World A Payments Legalian' });
});

module.exports = router;
