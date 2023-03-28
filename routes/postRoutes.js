const express = require('express')
const router = express.Router()
const {getPost, getPosts,createPost, deletePost, updatePost} = require('../controllers/postController')
const {protect} = require('../middleware/authMiddleware')

// Reroute into comment router
const commentRouter = require('./commentRoutes')
router.use('/:id/comments', commentRouter)


router.route('/').get(getPosts).post(protect, createPost)
router.route('/:id').get(getPost).delete(protect, deletePost)
router.route('/:id/edit').patch(protect, updatePost)


module.exports = router;