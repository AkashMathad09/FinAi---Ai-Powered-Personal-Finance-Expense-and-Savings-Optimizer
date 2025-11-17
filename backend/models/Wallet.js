const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 50000.00 // Give every new user a default fake balance
    },
    fakeUpiId: {
        type: String,
        unique: true,
        sparse: true, // This allows multiple users to not have one, but if they do, it's unique
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', WalletSchema);