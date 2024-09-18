const express = require('express');
const router = express.Router();

const PlaneController = require('../controllers/planeController')

router.get('/planes', PlaneController.getAll)

router.get('/', (req, res, next) => {
  res.json({ message: 'Hello World A Payments Legalian' });
});

module.exports = router;
