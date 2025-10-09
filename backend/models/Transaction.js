const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add a description'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify a type (income/expense)'],
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please add a category'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);