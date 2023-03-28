const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel')
const User = require('../models/userModel')

const likePost = asyncHandler(async (req,res)=>{

    const likeAuthor = await User.findById(req.user._id)
    await Post.updateOne({_id:req.params.id},{$push: {likes: likeAuthor.name}})
    res.status(200).send()
})

const getLikes = asyncHandler(async (req,res)=>{

    const likedPost = await Post.findById(req.params.id)
    
    res.status(200).json(likedPost.likes.length)
})



module.exports = {likePost, getLikes}