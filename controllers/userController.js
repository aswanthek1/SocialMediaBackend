const asyncHandler = require('express-async-handler')
require("dotenv").config()
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { validateEmail, validateLength } = require('../helpers/validation')
const mongoose = require('mongoose')



module.exports = {

    ///register user
    register: asyncHandler(async (req, res) => {
        console.log(req.body)
        const { firstname,
            lastname,
            email,
            phonenumber,
            password,
            gender,
            // dateofbirth,

        } = req.body

        if (!validateEmail(email)) {
            res.status(400).json({ message: 'invlaid email address' })
            // throw new Error('Invalid email address')
        }

        const check = await userModel.findOne({ $or: [{ email }, { phonenumber }] })
        if (check) {
            res.json({ message: 'This email already exists, try another one' })
            throw new Error('Email already exists')

        }
        else if (!validateLength(firstname, 3, 12)) {
            res.json({ message: 'First name need minimum 3 and maximum 12 characters' })
            throw new Error('First name need minimum 3 and maximum 12 characters')
        }
        else if (!validateLength(lastname, 1, 12)) {
            res.json({ message: 'Last name need minimum 1 and maximum 12 characters' })
            throw new Error('Last name need minimum 1 and maximum 12 characters')
        }
        else if (!validateLength(phonenumber, 10, 10)) {
            res.json({ message: 'Please enter a valid mobile number' })
            throw new Error('Please enter a valid mobile number')
        }
        else if (!validateLength(password, 6, 16)) {
            res.json({ message: 'Password need minimum 6 or maximum 16 characters' })
            throw new Error('Password need minimum 6 or maximum 16 characters')
        }

        else {
            let bcryptedPassword = await bcrypt.hash(password, 12)
            console.log(bcryptedPassword)
            const user = await new userModel({
                firstname,
                lastname,
                email,
                phonenumber,
                password: bcryptedPassword,
                gender,
            }).save()
            const token = jwt.sign(
                { _id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h',
                }
            )
            ///save userToken
            user.token = token
            res.status(200).json({
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phonenumber: user.phonenumber,
                token
            })
        }
    }),

    ///google register
    googleRegister: asyncHandler(async (req, res) => {
        console.log("req.body of google", req.body);
        const email = req.body.email
        const firstname = req.body.given_name
        const lastname = req.body.family_name
        if (!email) {
            res.json({ message: 'missing credentials' })
            throw new Error('missing credentials')
        }
        const alreadyLogged = await userModel.findOne({ email: email })
        if (alreadyLogged) {
            res.json({ message: 'user already exists' })
            throw new Error('user already exists')
        }
        const user = await userModel({
            email,
            firstname,
            lastname
        })
        user.save()
        const token = jwt.sign(
            { _id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: '24h'
            }
        )
        console.log(token)
        res.status(200).json({ user, token })

    }),



    ///login user
    loginUser: asyncHandler(async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            res.json({ message: 'Please fill up your details' })
            throw new Error('Details are missing')
        }
        let user = await userModel.findOne({ email: email })
        if (user && (await bcrypt.compare(password, user.password))) {
            //generating token 
            const token = jwt.sign({
                _id: user._id, email
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                }
            )
            res.status(200).json({
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                token
            })
        } else {
            res.json({ message: 'user not found' })
            throw new Error('User not found')
        }
    }),

    ///google login
    googleLogin: asyncHandler(async (req, res) => {
        console.log(req.body, "req.body")
        const email = req.body.email
        const user = await userModel.findOne({ email: email })
        if (!user) {
            res.json({ message: 'you first signup' })
            throw new Error('didnt signup yet')
        }
        else {
            const token = jwt.sign({
                _id: user._id, email
            },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '24h'
                }
            )
            res.status(200).json({
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                token
            })
        }

    }),

    ///user details getting
    getUser: asyncHandler(async (req, res) => {
        const user = await userModel.findOne({ _id: req.user._id })
        if (user) {
            res.status(200).json(user)
        }
        else {
            res.json({ message: 'userNotFound' })
            throw new Error('User not found')
        }
    }),

    ///user Searching
    userSearch: asyncHandler(async (req, res) => {
        console.log("req.params", req.params.data)
        // if(req.params.data === null){
        //     res.status(400).json({message:'no entries'})
        //     throw new Error('nothing entered')
        // }else{
        const searchResult = await userModel.find({ firstname: new RegExp('^' + req.params.data, 'i') })
        console.log("search result ", searchResult)
        const result = searchResult.map((value) =>
            value.firstname + " " + value.lastname
        )
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: 'No results' })
            throw new Error('No results')
        }
        // }
    }),

    ///add post
    addPost: asyncHandler(async (req, res) => {
        console.log(req.body)
        const { image, description } = req.body
        const userId = req.user._id
        if (!image || !description) {
            res.json({ message: 'No inputs added' })
            throw new Error('No inputs Entered')
        }
        else if (!userId) {
            res.json({ message: 'unauthorized' })
            throw new Error('Un authorized')
        }
        else {
            const date = new Date().toDateString()
            const post = await new postModel({ description, userId, image, date }).save()
            const addedPost = await postModel.findOne({_id:post._id}).populate('userId')
            console.log('post date', addedPost)
            res.status(200).json(addedPost)
        }
    }),

    //logout auth
    authState: asyncHandler(async (req, res) => {
        console.log("logout", req.users)
        res.status(200).json({ message: 'logout authentication successfull' })
    }),

    //login auth
    userLoginAuth: asyncHandler(async (req, res) => {
        console.log("login", req.users)
        res.status(200).json({ messsage: 'login auth success' })
    }),


    ///get post 
    getPost: asyncHandler(async (req, res) => {
        console.log(req.user)
        try {
            const id = req.user._id
            const userId = mongoose.Types.ObjectId(id);
            if (!userId) {
                res.json({ message: 'no post found' })
                throw new Error('No post found')
            }
            else {
                const posts = await postModel.find({ userId }).populate('userId').sort({ createdAt: -1 })
                console.log(posts, "posts are here")
                if (posts) {
                    res.status(200).json(posts)
                }
                else {
                    res.json({ message: "no posts found" })
                    throw new Error('No posts found')
                }
            }

        } catch (error) {
            console.log(error)
        }
    }),


    ///like post
    postLike: asyncHandler(async (req, res) => {
        console.log(req.body)
        let userId = mongoose.Types.ObjectId(req.body.userid)
        let postid = mongoose.Types.ObjectId(req.body.postid)
        let likedUser = await postModel.findOne({ _id: postid, likes: [userId] })
        console.log(likedUser, 'userlike')
        if (likedUser) {
            let unlike = await postModel.findOneAndUpdate({ _id: postid },
                {
                    $pull: { likes: [userId] }
                }).populate('userId')
            console.log(unlike, "userUnlike")
            res.status(200).json({unlike,message:'unliked'})
        } else {
            let liked = await postModel.findByIdAndUpdate({ _id: postid },
                {
                    $push: { likes: [userId] }
                }).populate('userId')
             console.log(liked,"liked")
            res.status(200).json({liked,message:'liked'})
        }


    }),


    ///get likes
    getLikes: asyncHandler(async (req, res) => {
        const userId = mongoose.Types.ObjectId(req.user._id)
        const postid = mongoose.Types.ObjectId(req.headers.postid)
        const likes = await postModel.findById({ _id: postid })
        const totalLikes = likes.likes.length
        res.status(200).json(totalLikes)
    }),


    ///add comment
    addComment: asyncHandler(async (req, res) => {
        const comment = req.body.values.comment
        const userid = mongoose.Types.ObjectId(req.params.id)
        const postid = mongoose.Types.ObjectId(req.body.postid)
        if (!comment) {
            res.json({ message: 'Enter something' })
            throw new Error('Enter something')
        }
        else {
            const postComment = await postModel.updateOne({ _id: postid },
                {
                   $push: {
                        comments: {
                            comment: comment,
                            commentBy: userid
                        }
                    }
                }
            )            
            const commentedPost = await postModel.findOne({_id:postid}).populate('userId')
            res.status(200).json(commentedPost)
        }


    })


}