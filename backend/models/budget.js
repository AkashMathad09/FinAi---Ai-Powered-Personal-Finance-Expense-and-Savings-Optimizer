const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The monthly limit amount
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    // We'll also store the month/year this budget applies to
    month: {
        type: Number, // 0 = Jan, 1 = Feb, etc.
        required: true
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure one budget per user per month
BudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);