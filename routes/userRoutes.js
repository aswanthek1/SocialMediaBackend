const express = require('express')
const router = express.Router()
const {register,loginUser,getUser} = require('../controllers/userController')
const userAuth = require('../middlewares/userAuthMiddleware')

router.post('/register',register)
router.post('/login',loginUser)
router.get('/',userAuth,getUser)



module.exports = router