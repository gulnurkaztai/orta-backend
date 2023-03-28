const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel')

// Get user posts
// GET /api/posts
const getPosts = asyncHandler(async (req,res)=>{
    const posts = await Post.find()
    .slice()
    .sort({createdAt:-1})
    .exec((err, posts)=>{
        res.status(200).json(posts)
    })
})

// Get user post
// GET /api/posts/:id
const getPost = asyncHandler(async (req,res)=>{
    const post = await Post.findById(req.params.id)

    if(!post){
        res.status(404)
        throw new Error('Post not found')
    } 

    res.status(200).json(post)
})

// Create new post
// POST /api/posts/create
const createPost = asyncHandler(async (req,res)=>{
    const {title, text, tags} = req.body

    if(!title || !text){
        res.status(400)
        throw new Error('Please make sure your post has a title, description and the body text')
    }

    const post = await Post.create({
        user_id: req.user.id,
        user_name: req.user.name,
        user_photo: req.user.avatarPic,
        title ,
        text,
        comments: [],
        tags: []
    })

    res.status(201).json(post)

})

// Delete user post
// Delete /api/posts/:id
const deletePost = asyncHandler(async (req,res)=>{
    const post = await Post.findById(req.params.id)

    if (!post) {
      res.status(404)
      throw new Error('post not found')
    }
  
    if (post.user_id.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
    }

    await post.remove()
    res.status(200).json({success: true})
})

// Update user post
// Update /api/posts/:id
const updatePost = asyncHandler(async (req,res)=>{
    const post = await Post.findById(req.params.id)

    if (!post) {
      res.status(404)
      throw new Error('post not found')
    }
  
    if (post.user_id.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(200).json(updatedPost)
})


module.exports = {
    getPost,
    getPosts,
    createPost,
    deletePost,
    updatePost
    
}