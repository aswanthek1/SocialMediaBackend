const express = require('express')
const router = express.Router()
const userAuth = require('../middlewares/userAuthMiddleware')
const { register, loginUser, getUser, userSearch, addPost,
    authState, userLoginAuth, getPost, postLike, getLikes,
    googleRegister, googleLogin, addComment, addCoverImage,
    addProfileImg
} = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/register', register)
router.get('/', userAuth, getUser)
router.post('/addPost', userAuth, addPost)
router.get('/getPost', userAuth, getPost)
router.get('/userSearch/:data', userSearch)
router.get('/userLogoutAuth', userAuth, authState)
router.get('/userLoginAuth', userAuth, userLoginAuth)
router.post('/postLike', postLike)
router.get('/getLike', userAuth, getLikes)
router.post('/googleRegister', googleRegister)
router.post('/googleLogin', googleLogin)
router.post('/addComment/:id', addComment)
router.post('/addCoverImg', userAuth, addCoverImage)
router.post('/addProfileImg', userAuth, addProfileImg)



module.exports = router