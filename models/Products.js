const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    productid: {
        type: String,
        required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Product", Product);