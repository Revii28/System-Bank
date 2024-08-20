const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    packet: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Account', AccountSchema);
