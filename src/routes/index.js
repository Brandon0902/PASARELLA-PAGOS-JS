const express = require('express');
const router = express.Router();

const PlaneController = require('../controllers/planeController')
const SubscriptionController = require('../controllers/subscriptionController')

router.get('/planes', PlaneController.getAll)

router.post('/subscriptions', SubscriptionController.create)

router.get('/', (req, res, next) => {
  res.json({ message: 'Hello World A Payments Legalian' });
});

module.exports = router;
