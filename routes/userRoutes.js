const express  = require("express")
const router = express.Router()
const {registerUser, loginUser, getMe, getUsers, updateProfile,requestPasswordReset,
    resetPassword} = require("../controllers/userController")
const {protect} = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/reset-request', requestPasswordReset)
router.patch('/reset/:token/:user_id', protect, resetPassword)
router.get('/:id/me', protect, getMe)
router.get('/', getUsers)
router.patch('/update/:id', protect, updateProfile)


module.exports = router