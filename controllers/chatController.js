const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messageModel");
const mongoose = require("mongoose");

module.exports = {
  ///add message
  addMessage: asyncHandler(async (req, res) => {
    try {
      const authorId = mongoose.Types.ObjectId(req.body.messageData.authorId);
      const receiverId = mongoose.Types.ObjectId(req.body.messageData.receiver);
      let messageData = req.body.messageData;
      if (messageData.message) {
        const checkRoom = await messageModel
          .findOne({
            users: {
              $all: [authorId, receiverId],
            },
          })
          .populate("users");
        if (!checkRoom) {
          const saveMessage = await messageModel.create({
            users: [authorId, receiverId],
            messages: [
              {
                roomId: messageData.roomId,
                author: messageData.author,
                message: messageData.message,
                time: messageData.time,
              },
            ],
          });
          saveMessage.save();
          res.status(200).json(saveMessage);
        } else {
          const updateRoom = await messageModel.updateOne(
            {
              users: {
                $all: [authorId, receiverId],
              },
            },
            {
              $push: {
                messages: [
                  {
                    roomId: messageData.roomId,
                    author: messageData.author,
                    message: messageData.message,
                    time: messageData.time,
                  },
                ],
              },
            }
          );
          res.status(200).json(updateRoom);
        }
      } else {
        res.json({ message: "add some message" });
      }
    } catch (error) {
      res.status(500).json({ error, message: "errorrroroorooroor" });
    }
  }),

  ///get messages
  getChat: asyncHandler(async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      console.log(userId);
      const chat = await messageModel
        .find({
          users: { $in: [userId] },
        })
        .populate("users");
      res.status(200).json(chat);
    } catch (error) {
      console.log("error", error);
      res.status(500).json(error);
    }
  }),
};
