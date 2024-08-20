const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
});

module.exports = mongoose.model('Customer', CustomerSchema);
