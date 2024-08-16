var express = require('express');
var router = express.Router();

//อัพโหลดไฟล์
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })
//เพิ่ม product
const productSchema = require('../models/product')
router.post('/api/v1/products', upload.single('imageUrl'), async function(req, res, next) {
const { name, detail, price, stock} = req.body; 
      if (!req.file) {
      return res.status(400).json({
          status: 400,
          message: "Image file is required",
          success: false
      });
  }
 
  const imageUrl = `/images/${req.file.filename}`;  // สร้าง URL สำหรับรูปภาพ 
    
    try{
      const product = await productSchema.create({
        name, 
        detail, 
        price,
        stock,
        imageUrl
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
    router.put('/api/v1/products/:id', upload.single('imageUrl'), async function(req, res, next) {
        const { id } = req.params; 
        const { name, detail, price, stock } = req.body;
       
        imageUrl = `/images/${req.file.filename}`; // สร้าง URL สำหรับรูปภาพใหม่
      

        try {
            const product = await productSchema.findByIdAndUpdate(
                id,
                { name, detail, price, stock, imageUrl},             
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
        if (detail !== undefined) product.detail = detail;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (imageUrl !== undefined) product.imageUrl = imageUrl;

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