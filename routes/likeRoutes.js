const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {likePost, getLikes} = require('../controllers/likeController')

router.put('/:id/likes',protect, likePost)
router.get('/:id/likes', protect, getLikes)

module.exports = router