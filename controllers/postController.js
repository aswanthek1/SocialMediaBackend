const asyncHandler = require('express-async-handler')
require('dotenv').config()
const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const mongoose = require('mongoose')


module.exports = {
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
            const addedPost = await postModel.findOne({ _id: post._id }).populate('userId')
            console.log('post date', addedPost)
            res.status(200).json(addedPost)
        }
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
            res.status(200).json({ unlike, message: 'unliked' })
        } else {
            let liked = await postModel.findByIdAndUpdate({ _id: postid },
                {
                    $push: { likes: [userId] }
                }).populate('userId')
            console.log(liked, "liked")
            res.status(200).json({ liked, message: 'liked' })
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
                            commentBy: userid,
                        }
                    }
                }
            )
            res.status(200).json(postComment)
        }


    }),





}