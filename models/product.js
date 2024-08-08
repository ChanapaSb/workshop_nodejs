const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['dessert', 'drink'], // กำหนดประเภทของสินค้า
    },
    price: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'baht'
    },
    stock: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('products', productSchema); 
