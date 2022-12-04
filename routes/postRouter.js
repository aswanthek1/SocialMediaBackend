const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const {
  addPost,
  getPost,
  postLike,
  getLikes,
  addComment,
  getUserPost,
  getAllPosts
} = require("../controllers/postController");

router.post("/addPost", userAuth, addPost);
router.get("/getPost", userAuth, getPost);
router.post("/postLike", postLike);
router.get("/getLike", userAuth, getLikes);
router.post("/addComment/:id", addComment);
router.get('/getPost/:id', userAuth, getUserPost)
router.get('/allPosts', userAuth, getAllPosts)

module.exports = router;
