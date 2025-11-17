const Transaction = require('../models/Transaction');
const Budget = require('../models/budget');

// Helper to get current month/year
const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return { startOfMonth, endOfMonth, month: now.getMonth(), year: now.getFullYear() };
};

// @desc    Check reward status for the current month
// @route   GET /api/rewards/status
exports.getRewardStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startOfMonth, endOfMonth, month, year } = getCurrentMonthRange();

        // 1. Get the user's set budget for this month
        const budget = await Budget.findOne({ user: userId, month, year });

        // If user hasn't set a budget, they can't get a reward
        if (!budget || budget.amount === 0) {
            return res.json({
                hasReward: false,
                message: "You haven't set a budget for this month. Set one on the 'AI Budget' page to start earning rewards!",
                budgetLimit: 0,
                totalExpense: 0
            });
        }

        // 2. Find all EXPENSE transactions for this month
        const transactions = await Transaction.find({
            user: userId,
            type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 3. Calculate total expenses
        let totalExpense = 0;
        transactions.forEach(t => {
            totalExpense += t.amount;
        });

        // 4. Check if they earned the reward
        if (totalExpense <= budget.amount) {
            // SUCCESS!
            res.json({
                hasReward: true,
                message: "You did it! You stayed under your budget. Here is your reward.",
                budgetLimit: budget.amount,
                totalExpense: totalExpense
            });
        } else {
            // Failed
            res.json({
                hasReward: false,
                message: "You went over your budget this month. Try again next month!",
                budgetLimit: budget.amount,
                totalExpense: totalExpense
            });
        }

    } catch (error) {
        console.error('Error in getRewardStatus:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};