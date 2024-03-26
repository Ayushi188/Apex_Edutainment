const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    created_at: { type: Date, default: Date.now },
    billingAddress: {
        firstName: {
          type: String,
          required: true
        },
        lastName: {
          type: String,
          required: true
        },
        phoneNumber: String, // Optional
        addressLine1: {
          type: String,
          required: true
        },
        addressLine2: String,
        province: {
          type: String,
          required: true
        },
        country: {
          type: String,
          default: 'Canada'
        },
        postalCode: {
          type: String,
          required: true
        }
      }
    });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
