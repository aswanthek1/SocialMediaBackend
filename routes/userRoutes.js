const express = require('express')
const router = express.Router()
const userAuth = require('../middlewares/userAuthMiddleware')
const { register, loginUser, getUser, userSearch, addPost,
    authState, userLoginAuth, getPost, postLike, getLikes,
    googleRegister, googleLogin, addComment, addCoverImage,
    addProfileImg, allUsers, addFollow, unFollow, removeFollowers
} = require('../controllers/userController')

router.post('/login', loginUser)
router.post('/register', register)
router.post('/googleLogin', googleLogin)
router.post('/googleRegister', googleRegister)
router.get('/userLogoutAuth', userAuth, authState)
router.get('/userLoginAuth', userAuth, userLoginAuth)
router.get('/', userAuth, getUser)
router.post('/addPost', userAuth, addPost)
router.get('/getPost', userAuth, getPost)
router.post('/postLike', postLike)
router.get('/getLike', userAuth, getLikes)
router.get('/userSearch/:data', userSearch)
router.post('/addComment/:id', addComment)
router.post('/addCoverImg', userAuth, addCoverImage)
router.post('/addProfileImg', userAuth, addProfileImg)
router.get('/users', userAuth, allUsers)
router.post('/addFollow', userAuth, addFollow)
router.post('/unFollow', userAuth, unFollow )
router.post('/follwers/remove', userAuth, removeFollowers)



module.exports = router