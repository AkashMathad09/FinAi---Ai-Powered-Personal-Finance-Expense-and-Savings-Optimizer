const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// We will create these controller functions in the next step
const { 
    getBudgetSummary,
    getExpenseByCategory,
    setBudget, 
    getBudgetSuggestions
} = require('../controllers/budgetController');

// @route   GET /api/budget/summary
// @desc    Get user's monthly income, expenses, and savings
router.get('/summary', protect, getBudgetSummary);

// @route   GET /api/budget/expense-categories
// @desc    Get user's expenses grouped by category for a chart
router.get('/expense-categories', protect, getExpenseByCategory);
router.get('/suggestions', protect, getBudgetSuggestions); 
router.post('/set', protect, setBudget); 

module.exports = router;