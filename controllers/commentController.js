const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')

// 
const getComments = asyncHandler(async(req,res)=>{
    const comments = await Comment.find({post: req.params.postId});
    res.status(200).json(comments)
})


// Create new comment
const createComment = asyncHandler(async (req,res)=>{

    if(!req.body.text){
        res.status(400)
        throw new Error('A comment cannot be empty')
    }

    const comment = await Comment.create({
        text: req.body.text,
        post_id: req.params.id,
        user_id: req.user.id,
        user_photo: req.user.avatarPic,
    })

    await Post.updateOne({_id:req.params.id},{$push: { comments: comment} })


    res.status(201).json(comment)
})




module.exports = {
    createComment,
    getComments,
}