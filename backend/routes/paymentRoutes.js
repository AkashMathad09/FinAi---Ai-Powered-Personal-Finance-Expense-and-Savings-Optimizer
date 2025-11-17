const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// This line below is the one we need to check
const { transferFunds } = require('../controllers/paymentController');

router.post('/transfer', protect, transferFunds);

module.exports = router;