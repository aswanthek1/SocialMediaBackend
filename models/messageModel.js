const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    users:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'users'
    }],
    messages:[{
      roomId:String,
      author:String,
      message:String,
      time:String
    }]

}, {timestamps:true})


module.exports = mongoose.model('messages', messageSchema)