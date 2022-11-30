const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/userAuthMiddleware");
const {
  register,
  loginUser,
  getUser,
  userSearch,
  authState,
  userLoginAuth,
  googleRegister,
  googleLogin,
  addCoverImage,
  addProfileImg,
  allUsers,
  addFollow,
  unFollow,
  removeFollowers,
  updateUser,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", register);
router.post("/googleLogin", googleLogin);
router.post("/googleRegister", googleRegister);
router.get("/userLogoutAuth", userAuth, authState);
router.get("/userLoginAuth", userAuth, userLoginAuth);
router.get("/userSearch/:data", userSearch);
router.post("/addCoverImg", userAuth, addCoverImage);
router.post("/addProfileImg", userAuth, addProfileImg);
router.get("/", userAuth, getUser);
router.get("/users", userAuth, allUsers);
router.post("/unFollow", userAuth, unFollow);
router.post("/addFollow", userAuth, addFollow);
router.post("/follwers/remove", userAuth, removeFollowers);
router.put("/user/update", updateUser);

module.exports = router;
