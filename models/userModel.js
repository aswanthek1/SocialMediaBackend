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
    // dyear:{
    //     type:Number
    // },
    // dday:{
    //     type:Number
    // },
    // dmonth:{
    //     type:String
    // },
    dateofbirth:{
        type:'String'
    },
    password:{
        type:String
    },
    gender:{
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
    }]

},{timestamps:true})

module.exports = mongoose.model('users',userSchema)