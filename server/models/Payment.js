const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    payment_method: { type: String },
    status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
 
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
