const express = require("express");
const router = express.Router();
const {
  adminLogin,
  reportedPosts,
  removeReportedPost,
  declineReportRequest,
} = require("../controllers/adminController");
const adminAuth = require("../middlewares/userAuthMiddleware");

router.post("/login", adminLogin);
router.get("/reportedPosts", adminAuth, reportedPosts);
router.patch("/post/report", removeReportedPost);
router.delete("/post/declineReport/:id", declineReportRequest);

module.exports = router;
