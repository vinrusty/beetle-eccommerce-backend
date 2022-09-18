const mongoose = require('mongoose');

const RefreshToken = new mongoose.Schema({
    refreshToken: String
})

module.exports = mongoose.model("RefreshToken", RefreshToken);