const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    description: {
        type: String,
    },
    image: {
        type: Array
    },
    likes: {
        type: Array,
        default: []
    },
    comments: [
        {
            comment: {
                type: String
            },
            commentBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            createdAt: {
                type: Date,
                default: new Date()
            }
        }
    ],
    date: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('posts', postSchema)