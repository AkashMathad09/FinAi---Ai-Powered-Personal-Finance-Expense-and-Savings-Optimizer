const Wallet = require('../models/Wallet');

// @desc    Get current user's wallet balance
// @route   GET /api/wallet/balance
exports.getWalletBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        res.json({ balance: wallet.balance });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};