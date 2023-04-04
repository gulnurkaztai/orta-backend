const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto"); 


// Register a new user
// /api/users
const registerUser = asyncHandler(async (req,res)=>{
    const {name, email, password} = req.body

    // Validation
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please include all fields")
    }
    const emailLowerCase = email.toLowerCase();

    // Find if user already exists

    const userExists = await User.findOne({email: emailLowerCase})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Creaete User
    const user = await User.create({
        name,
        email: emailLowerCase,
        password: hashedPassword,
        avatarPic: '',
        bio:'',
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            avatarPic: '',
            bio:'',
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new error('Invalid user data')
    }

})

// Generate Token
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// Login a user
// /api/users/login
const loginUser = asyncHandler(async(req,res)=>{

    const {email, password} = req.body
    const user = await User.findOne({email})

    // Check user and password match
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            avatarPic: user.avatarPic,
            bio:'',
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error ('Invalid credentials')
    }
})

// Sendinf email for password reset
const requestPasswordReset = asyncHandler(async(req, res)=>{
    try{
    const {email} = req.body

    const emailLowerCase = email.toLowerCase();

    // Find if user exists
    const user = await User.findOne({email: emailLowerCase})

    if (!user) {
        res.status(404)
        throw new Error("User does not exist")
    }
    let token = await Token.findOne({ user_id: user._id });
    let resetToken = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(resetToken, salt);

    if (!token) {
        token =  await new Token({
      user_id: user._id,
      token: hash,
    }).save();
}console.log(token)
    const link = `orta.onrender.com/reset/${resetToken}/${user._id}`;
    await sendEmail(user.email,"Password Reset Request",{link}, "../utils/requestResetPassword.handlebars");
    console.log(link)
    res.status(201).send({message: "SENTT"})
    
  }catch(error){
    console.log(error)
    res.status(500).send({message: "NOOT SENT"})
  }

})

// Reset password 

const resetPassword = asyncHandler(async(req, res) => {

    const {user_id, token, password} = req.body;
    let passwordResetToken = await Token.findOne({ user_id });
    console.log(user_id)
    console.log(passwordResetToken)

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token!");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: user_id },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: user_id });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.name,
      },
      "../utils/resetPassword.handlebars"
    );
    await passwordResetToken.deleteOne();
    return true;
  })


// Get current user
// /api/users/me
// Private
const getMe = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(404)
        throw new Error('User not found')
      }
    res.status(200).json(user)
})

// Get all users
const getUsers = asyncHandler(async (req, res)=>{
    const users = await User.find();
    res.status(200).json(users)
})

const updateProfile = asyncHandler(async (req, res)=>{
        const user = await User.findById(req.user.id)

        if (!user) {
            res.status(404)
            throw new Error('User not found')
          }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {new:true});
        res.status(200).json(updatedUser)
})


module.exports = {
    registerUser,
    loginUser,
    requestPasswordReset ,
    resetPassword,
    getMe,
    getUsers,
    updateProfile
}