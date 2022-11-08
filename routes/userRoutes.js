const express = require('express')
const router = express.Router()
const {register,loginUser,getUser,userSearch} = require('../controllers/userController')
const userAuth = require('../middlewares/userAuthMiddleware')

router.post('/register',register)
router.post('/login',loginUser)
router.get('/',userAuth,getUser)
router.get('/userSearch',userSearch)



module.exports = router