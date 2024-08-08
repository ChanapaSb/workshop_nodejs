var express = require('express');
var router = express.Router();

//เพิ่ม product
const productSchema = require('../models/product')
router.post('/api/v1/products', async function(req, res, next) {
    const { name, category, price, stock} = req.body; try{
      const product = await productSchema.create({
        name, 
        category, 
        price,
        stock
      });
      res.status(201).json({ 
        status: 201,
        message: "Add product successfully" ,
        data: product
      });
    
     }catch (error){
      res.status(400).send(error)({
        status: 400,
        message: "Failed to add product",
        success: false
      });
     }
    });
    
    //แก้ไข product
    router.put('/api/v1/products/:id', async function(req, res, next) {
        const { id } = req.params; 
        const { name, category, price, stock } = req.body;

        try {
            const product = await productSchema.findByIdAndUpdate(
                id,
                { name, category, price, stock},             
                { new: true, runValidators: true } // new: true จะให้คืนค่าเอกสารที่อัปเดตแล้ว, runValidators: true ใช้การตรวจสอบค่าใหม่
            );

            if (!product) {
                return res.status(404).json({
                    status: 404, 
                    message: "Product not found",
                    success: false
                });
            } 
             // อัปเดตฟิลด์ที่มีการส่งเข้ามาเท่านั้น
        if (name !== undefined) product.name = name;
        if (category !== undefined) product.category = category;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;

        // บันทึกการอัปเดต
        const updatedProduct = await product.save();
     
            res.status(200).json({
                status: 200,
                message: "Product updated successfully",
                data: product
            });
    
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Failed to update product",
                success: false,
            });
        }
    });

    //ลบ product
    router.delete('/api/v1/products/:id', async function(req, res, next) {
        const { id } = req.params
        try {
        const product = await productSchema.findByIdAndDelete(id, { new: true, runValidators: true })

        if (!product) {
            return res.status(404).json({
              status: 404,
              message: "Product not found"
            });
          }
          res.status(200).json({
            status: 200,
            message: "Product delete successfully",
            data: product          
        });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Failed to delete product",
                success: false,
            });
        }
      });

      //แสดงรายการ product ทั้งหมด
      router.get('/api/v1/products', async function(req, res, next) {
        try {
        const product = await productSchema.find({})
          res.status(200).json({
            status: 200,
            message: "Get all product successfully",
            data: product          
        });
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: "Failed to get all product",
                data: []
           });
        }
      });

      //ดูรายการ product 1 รายการ
      router.get('/api/v1/products/:id', async function(req, res, next) {
        const { id } = req.params
             
        try {
        const product = await productSchema.findById(id);

        // ตรวจสอบว่าพบผลิตภัณฑ์หรือไม่
            if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                data: []
            });
            }
    
          res.status(200).json({
            status: 200,
            message: "Get the product successfully",
            data: product          
        });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: "Failed to get the product",
                data: []
           });
        }
      });
module.exports = router;