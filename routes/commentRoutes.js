const express = require('express')
const router = express.Router({mergeParams:true})
const {protect} = require('../middleware/authMiddleware')
const {createComment, getComments} = require('../controllers/commentController')

router.route('/').post(protect, createComment).get(getComments)

module.exports = router