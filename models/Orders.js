const mongoose = require('mongoose')

const Order = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    orderName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    paymentMode: {
        type: String,
        required: true
    },
    cartItems: {
        type: Array,
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model("Order", Order)