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
    comments: {
        type: Array
    },
    date: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('posts', postSchema)