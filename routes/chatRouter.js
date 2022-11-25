const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const { addMessage, getChat } = require("../controllers/chatController");

router.post("/addMessage", addMessage);
router.get('/messages',userAuth, getChat)


module.exports = router;
