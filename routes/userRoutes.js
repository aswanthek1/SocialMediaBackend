const express = require('express')
const router = express.Router()
const { register, loginUser, getUser, userSearch, addPost } = require('../controllers/userController')
const userAuth = require('../middlewares/userAuthMiddleware')

router.post('/register',register)
router.post('/login',loginUser)
router.get('/',userAuth,getUser)
router.get('/userSearch/:data',userSearch)
router.post('/addPost',userAuth,addPost)



module.exports = router