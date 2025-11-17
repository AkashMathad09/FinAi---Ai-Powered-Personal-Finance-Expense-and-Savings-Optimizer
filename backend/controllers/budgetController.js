const Transaction = require('../models/Transaction');
const Budget = require('../models/budget'); // 1. Import new model
const { getAIBudgetSuggestion } = require('../ai/gemini'); // 2. Import real AI function
const mongoose = require('mongoose');

// Helper to get current month/year
const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { startOfMonth, endOfMonth, month: now.getMonth(), year: now.getFullYear() };
};

// @desc    Get monthly summary AND the user's set budget
// @route   GET /api/budget/summary
exports.getBudgetSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startOfMonth, endOfMonth, month, year } = getCurrentMonthRange();

        // 1. Get the user's set budget for this month
        const budget = await Budget.findOne({ user: userId, month, year });

        // 2. Find all transactions for this month
        const transactions = await Transaction.find({
            user: userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 3. Calculate totals
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else totalExpense += t.amount;
        });

        // 4. Send all data back
        res.json({
            budgetLimit: budget ? budget.amount : 0, // 0 if no budget is set
            totalIncome,
            totalExpense,
            month: startOfMonth.toLocaleString('default', { month: 'long' })
        });

    } catch (error) {
        console.error('Error in getBudgetSummary:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set or update the budget for the current month
// @route   POST /api/budget/set
exports.setBudget = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const { month, year } = getCurrentMonthRange();

        // Find and update, or create if it doesn't exist (upsert)
        const budget = await Budget.findOneAndUpdate(
            { user: userId, month, year }, // Find this...
            { amount: parseFloat(amount) },  // ...set this...
            { new: true, upsert: true, runValidators: true } // ...options
        );

        res.status(201).json({ message: 'Budget set successfully!', budget });

    } catch (error) {
        console.error('Error in setBudget:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get AI-powered budget suggestions (NOW WITH REAL AI)
// @route   GET /api/budget/suggestions
exports.getBudgetSuggestions = async (req, res) => {
    try {
        const userId = req.user.id;
        // 1. Get past 90 days of transactions
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const transactions = await Transaction.find({ user: userId, date: { $gte: ninetyDaysAgo } });

        // 2. Calculate average monthly income and expenses
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += t.amount;
            else totalExpense += t.amount;
        });
        const avgMonthlyIncome = (totalIncome / 3).toFixed(2);
        const avgMonthlyExpense = (totalExpense / 3).toFixed(2);

        // 3. Call the REAL AI
        const suggestions = await getAIBudgetSuggestion(avgMonthlyIncome, avgMonthlyExpense);

        res.json({
            suggestions,
            context: `Based on an average monthly income of ₹${avgMonthlyIncome} and expenses of ₹${avgMonthlyExpense}.`
        });

    } catch (error) {
        console.error('Error in getBudgetSuggestions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get expenses grouped by category (for chart)
// @route   GET /api/budget/expense-categories
exports.getExpenseByCategory = async (req, res) => {
    try {
        const { startOfMonth } = getCurrentMonthRange();
        const categoryData = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: 'expense',
                    date: { $gte: startOfMonth }
                }
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $project: { _id: 0, category: '$_id', total: 1 } }
        ]);
        res.json(categoryData);
    } catch (error) {
        console.error('Error in getExpenseByCategory:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};