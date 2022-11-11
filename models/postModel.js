const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    description:{
        type:String,
    },
    image:{
        type:Array
    },
    likes:{
        type:Array
    },
    comments:{
        type:Array
    },
    date:{
        type:Date
    }

},{timestamps:true})

module.exports = mongoose.model('posts',postSchema)