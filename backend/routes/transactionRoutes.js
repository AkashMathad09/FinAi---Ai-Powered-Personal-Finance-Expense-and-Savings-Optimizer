const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware is applied to both routes
router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

module.exports = router;