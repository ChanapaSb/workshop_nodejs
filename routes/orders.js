var express = require('express');
var router = express.Router();

const orderSchema = require('../models/order')
const productSchema = require('../models/product')

//เพิ่ม order
router.post('/api/v1/products/:id/orders', async function(req, res, next) {
    const { id } = req.params; // product id
    const { quantity} = req.body;

    try {
        // check product
        const product = await productSchema.findById(id);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                success: false
            });
        }

        //check product stock
        if (quantity > product.stock) {
            return res.status(400).json({
                status: 400,
                message: "Order quantity exceeds product stock",
                success: false
            });
        }

        // cal price
        const totalPrice = product.price * quantity;

        // create order
        const newOrder = await orderSchema.create({
            product: id, // ใช้ ObjectId ของผลิตภัณฑ์ที่อ้างอิง
            quantity,
            totalPrice,
        });
        
        //reduce the number of stock
        product.stock -= quantity;
        await product.save();

        res.status(201).json({
            status: 201,
            message: "Order created successfully",
            data: newOrder
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Failed to create order",
            success: false,
            error: error.message
        });
    }
});

//แสดง order ทั้งหมด
router.get('/api/v1/orders', async function(req, res, next) {
    try {
    const product = await orderSchema.find({})
    .populate('product', 'name') // Populate only the 'name' field from 'products'
    .exec();

    if (product.length === 0) {
        return res.status(200).json({
            status: 200,
            message: "No orders available at the moment.",
            data: product
        });
    }

    res.status(200).json({
        status: 200,
        message: "Get all orders successfully",
        data: product          
    });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Failed to get all orders",
    });
    }

    });

//แสดง order ทั้งหมดของ product นั้นๆ
router.get('/api/v1/products/:id/orders', async function(req, res, next) {
    const { id } = req.params; // product id
   

    try {
        // ค้นหาคำสั่งซื้อทั้งหมดที่มี product id ตรงกับที่ส่งมา
        //const orders = await orderSchema.find({ product: id });
        const orders = await orderSchema.find({ product: id }).populate('product', 'name');
        if (orders.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No orders found for this product",
                data: orders
            });
        }

        res.status(200).json({
            status: 200,
            message: "Get All Order for product successfully",
            data: orders         
        });

    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Failed to Get All Order for product",
            success: false,
            error: error.message
        });
    }
});


module.exports = router;