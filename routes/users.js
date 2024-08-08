var express = require('express');
var router = express.Router();

//นำเข้า Schema สำหรับ user
const userSchema = require('../models/user') 

//ใช้สำหรับเข้ารหัส
const bcrypt = require('bcrypt')

//สร้างและตรวจสอบ jwt
const jwt = require('jsonwebtoken') 

//นำเข้า middleware สำหรับการยืนยันตัวตน
const { authToken } = require("../middleware/auth");

//register
router.post('/api/v1/register', async function(req, res, next) {
const { storeName, username, phone, password } = req.body; try{
  let user = await userSchema.findOne({ username });
  if (user) {
  return res.status(400).json({ 
    status: 400,
    message: 'This user account already exists.', 
    success: false,
    data: user
  });
  }

  const newUser = await userSchema.create({
    storeName,
    username,
    phone,
    password :await bcrypt.hash(password, 10),
  });
  res.status(201).json({ 
    message: "Account created successfully." ,
    success: true,
    data: newUser
  });

 }catch (error){
  res.status(400).json({
    status: 400,
    message: "Failed to create account.",
    success: false,
  });
 }
});

//login
router.post('/api/v1/login', async function(req, res, next){
  let {username, password} = req.body;
  try {
    // check username
    let user = await userSchema.findOne({username});
    if (!user) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect', success: false });
    }

    // create JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, 'jwtsecret');
    res.status(200).json({
      status: 200,
      message: 'Login successful',
      token: token,
      data: user,
      success: true
    });

  }catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Login failed',
      success: false,
    });
  }
});

//approve account
router.put('/api/v1/approve/:id', authToken, async function(req, res, next) {
  const { id } = req.params;

  try {
    // ค้นหาผู้ใช้ที่มี id ตรงกับที่ส่งมา
    let user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ 
        status: 404,
        message: 'User not found', 
        success: false 
      });
    }

    // เปลี่ยนสถานะ
    user.isApproved = true;
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Account has been approved.',
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'An approval error occurred.',
      success: false,
      //error: error.message
    });
  }
});

module.exports = router;

