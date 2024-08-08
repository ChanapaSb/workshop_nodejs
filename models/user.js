const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    storeName : String,
    username : String,
    phone : String,
    password : String,
    isApproved: { type: Boolean, default: false }
}, {
    timestamps : true
});


module.exports = mongoose.model('users', userSchema);

