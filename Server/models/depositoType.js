const mongoose = require('mongoose');

const DepositoTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    yearlyReturn: { type: Number, required: true },
});

module.exports = mongoose.model('DepositoType', DepositoTypeSchema);
