const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// This line imports the function from the file you just saved
const { getWalletBalance } = require('../controllers/walletController');

// @route   GET /api/wallet/balance
// @desc    Get the current wallet balance
router.get('/balance', protect, getWalletBalance);

module.exports = router;