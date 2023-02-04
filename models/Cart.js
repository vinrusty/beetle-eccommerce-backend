const mongoose = require("mongoose")

const Cart = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    cartItemid: {
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        default: 0
    },
    product: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model("Cart", Cart);