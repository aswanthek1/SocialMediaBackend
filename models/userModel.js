const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        text:true
    },
    lastname:{
        type:String,
        text:true
    },
    email: {
        type: String
    },
    phonenumber:{
        type:Number
    },
    dateofbirth:{
        type:String,
    },
    password:{
        type:String
    },
    coverimage:[

    ],
    profileimage:[
        
    ],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    bio:{
        type:String,
    },
    proffession:{
        type:String
    },
    livesin:{
        type:String
    },
    country:{
        type:String
    }

},{timestamps:true})

module.exports = mongoose.model('users',userSchema)