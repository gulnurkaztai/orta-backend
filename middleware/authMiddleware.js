const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const {OAuth2Client} = require('google-auth-library')
const googleUser = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const protect = asyncHandler(async (req,res,next) =>{


    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get token from header
          let token = req.headers.authorization.split(' ')[1]
          const googleToken = token.length > 1000

          if (googleToken){
            const ticket = await googleUser.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            const payload = ticket.getPayload();
            req.user = {
                id: payload.sub,
                name: payload.name,
                avatarPic: payload.picture
            }
        } else {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)
            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            }
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    // if(!token) {
    //     res.status(401)
    //     throw new Error('Not authorized')
    // }
})

module.exports = {protect}
