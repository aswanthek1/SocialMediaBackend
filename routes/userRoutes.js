const express = require('express')
const router = express.Router()
const { register, loginUser, getUser, userSearch, addPost, authState, userLoginAuth, getPost, postLike, getLikes, googleRegister, googleLogin, addComment } = require('../controllers/userController')
const userAuth = require('../middlewares/userAuthMiddleware')

router.post('/register', register)
router.post('/login', loginUser)
router.get('/', userAuth, getUser)
router.get('/userSearch/:data', userSearch)
router.post('/addPost', userAuth, addPost)
router.get('/userLogoutAuth', userAuth, authState)
router.get('/userLoginAuth', userAuth, userLoginAuth)
router.get('/getPost', userAuth, getPost)
router.post('/postLike', postLike)
router.get('/getLike', userAuth, getLikes)
router.post('/googleRegister', googleRegister)
router.post('/googleLogin', googleLogin)
router.post('/addComment/:id',addComment)



module.exports = router