const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        priceAtPurchase: {
            type: Number,
            required: true
        }
    }],

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    payment: {
        transactionId: { type: String },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending'
        },
        amount: {
            type: Number,
            required: true
        }
    },

    shippingStatus: {
        type: String,
        enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Not Processed'
    },

    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true }
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
