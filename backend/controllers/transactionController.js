const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
// 👇 FIX 1: Re-enabled the AI import
const { getCategory } = require('../ai/gemini'); 

// @desc    Get all transactions for a user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
    try {
        const { description, amount, type } = req.body;
        const userId = req.user.id;

        // --- 1. AI Categorization (RE-ENABLED) ---
        // 👇 FIX 2: Replaced the bypassed line with the real AI call
        const category = await getCategory(description); 

        // --- 2. Update Wallet Balance ---
        const wallet = await Wallet.findOne({ userId: userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const numericAmount = parseFloat(amount);
        if (type === 'income') {
            wallet.balance += numericAmount;
        } else {
            wallet.balance -= numericAmount;
        }
        await wallet.save();

        // --- 3. Create and Save Transaction Record ---
        const newTransaction = new Transaction({
            user: userId, 
            description,
            amount: numericAmount,
            type,
            category: category, // This now uses the AI's category
            date: new Date()
        });

        await newTransaction.save();
        
        // Return the newly created transaction
        res.status(201).json(newTransaction);

    } catch (err) {
        console.error('Error in addTransaction:', err.message);
        res.status(500).send('Server Error');
    }
};