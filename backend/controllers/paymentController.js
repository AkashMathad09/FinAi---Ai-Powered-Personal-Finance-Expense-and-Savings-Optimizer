const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Transfer funds to another user
// @route   POST /api/payments/transfer
exports.transferFunds = async (req, res) => {
    const { toUpiId, amount } = req.body;
    const numericAmount = parseFloat(amount);
    const fromUserId = req.user.id; // From the 'protect' middleware

    try {
        // --- 1. VALIDATE INPUT ---
        if (!toUpiId || !numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: 'Invalid UPI ID or amount.' });
        }

        // --- 2. FIND SENDER & RECIPIENT ---
        const fromWallet = await Wallet.findOne({ userId: fromUserId });
        const toUser = await User.findOne({ upiId: toUpiId });

        if (!toUser) {
            return res.status(404).json({ message: 'Recipient not found.' });
        }

        const toWallet = await Wallet.findOne({ userId: toUser._id });

        if (!fromWallet || !toWallet) {
            return res.status(404).json({ message: 'Wallet not found.' });
        }

        // --- 3. SAFETY CHECKS ---
        if (fromWallet.userId.toString() === toWallet.userId.toString()) {
            return res.status(400).json({ message: 'You cannot send money to yourself.' });
        }
        if (fromWallet.balance < numericAmount) {
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        // --- 4. PERFORM THE TRANSFER ---
        fromWallet.balance -= numericAmount;
        toWallet.balance += numericAmount;

        // Save both wallets
        await fromWallet.save();
        await toWallet.save();

        // --- 5. CREATE TRANSACTION RECORDS ---
        await Transaction.create({
            user: fromUserId,
            description: `Transfer to ${toUser.username}`,
            amount: numericAmount,
            type: 'expense',
            category: 'Transfer',
        });
        await Transaction.create({
            user: toUser._id,
            description: `Transfer from ${req.user.username}`,
            amount: numericAmount,
            type: 'income',
            category: 'Transfer',
        });
        
        // --- 6. SUCCESS ---
        res.status(200).json({ 
            message: 'Transfer successful!', 
            newBalance: fromWallet.balance 
        });

    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ message: 'Server error during transfer.' });
    }
};