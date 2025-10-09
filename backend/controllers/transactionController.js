const Transaction = require('../models/Transaction');

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
    const { description, amount, type, category, date } = req.body;

    try {
        const newTransaction = await Transaction.create({
            user: req.user.id, // Link the transaction to the logged-in user
            description,
            amount,
            type,
            category,
            date,
        });
        res.status(201).json(newTransaction);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Security Check: Ensure the user owns the transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};