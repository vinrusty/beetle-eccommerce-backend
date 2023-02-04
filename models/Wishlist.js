const mongoose = require("mongoose")

const Wishlist = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    wishlistItemid: {
        type: String,
        required: true
    },
    productid: {
        type: String,
        required: true
    },
    product: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model("Wishlist", Wishlist)