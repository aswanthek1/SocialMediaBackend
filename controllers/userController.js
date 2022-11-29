const asyncHandler = require("express-async-handler");
require("dotenv").config();
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const messageModel = require("../models/messageModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateEmail, validateLength } = require("../helpers/validation");
const mongoose = require("mongoose");

module.exports = {
  ///register user
  register: asyncHandler(async (req, res) => {
    console.log(req.body);
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      gender,
      // dateofbirth,
    } = req.body;

    if (!validateEmail(email)) {
      res.status(400).json({ message: "invlaid email address" });
      // throw new Error('Invalid email address')
    }

    const check = await userModel.findOne({
      $or: [{ email }, { phonenumber }],
    });
    if (check) {
      res.json({ message: "This email already exists, try another one" });
      throw new Error("Email already exists");
    } else if (!validateLength(firstname, 3, 12)) {
      res.json({
        message: "First name need minimum 3 and maximum 12 characters",
      });
      throw new Error("First name need minimum 3 and maximum 12 characters");
    } else if (!validateLength(lastname, 1, 12)) {
      res.json({
        message: "Last name need minimum 1 and maximum 12 characters",
      });
      throw new Error("Last name need minimum 1 and maximum 12 characters");
    } else if (!validateLength(phonenumber, 10, 10)) {
      res.json({ message: "Please enter a valid mobile number" });
      throw new Error("Please enter a valid mobile number");
    } else if (!validateLength(password, 6, 16)) {
      res.json({ message: "Password need minimum 6 or maximum 16 characters" });
      throw new Error("Password need minimum 6 or maximum 16 characters");
    } else {
      let bcryptedPassword = await bcrypt.hash(password, 12);
      console.log(bcryptedPassword);
      const user = await new userModel({
        firstname,
        lastname,
        email,
        phonenumber,
        password: bcryptedPassword,
        gender,
      }).save();
      const token = jwt.sign({ _id: user._id, email }, process.env.TOKEN_KEY, {
        expiresIn: "24h",
      });
      ///save userToken
      user.token = token;
      res.status(200).json({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phonenumber: user.phonenumber,
        token,
      });
    }
  }),

  ///google register
  googleRegister: asyncHandler(async (req, res) => {
    console.log("req.body of google", req.body);
    const email = req.body.email;
    const firstname = req.body.given_name;
    const lastname = req.body.family_name;
    if (!email) {
      res.json({ message: "missing credentials" });
      throw new Error("missing credentials");
    }
    const alreadyLogged = await userModel.findOne({ email: email });
    if (alreadyLogged) {
      res.json({ message: "user already exists" });
      throw new Error("user already exists");
    }
    const user = await userModel({
      email,
      firstname,
      lastname,
    });
    user.save();
    const token = jwt.sign({ _id: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });
    console.log(token);
    res.status(200).json({ user, token });
  }),

  ///login user
  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({ message: "Please fill up your details" });
      throw new Error("Details are missing");
    }
    let user = await userModel.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      //generating token
      const token = jwt.sign(
        {
          _id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        token,
      });
    } else {
      res.json({ message: "user not found" });
      throw new Error("User not found");
    }
  }),

  ///google login
  googleLogin: asyncHandler(async (req, res) => {
    console.log(req.body, "req.body");
    const email = req.body.email;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.json({ message: "you first signup" });
      throw new Error("didnt signup yet");
    } else {
      const token = jwt.sign(
        {
          _id: user._id,
          email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      res.status(200).json({
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        token,
      });
    }
  }),

  ///user details getting
  getUser: asyncHandler(async (req, res) => {
    const user = await userModel.findOne({ _id: req.user._id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.json({ message: "userNotFound" });
      throw new Error("User not found");
    }
  }),

  ///user Searching
  userSearch: asyncHandler(async (req, res) => {
    try {
      console.log("req.params at searching", req.params);
      const userId = mongoose.Types.ObjectId(req.headers.user);

      const searchResult = await userModel.find({
        $and: [
          { _id: { $ne: userId } },
          { firstname: new RegExp("^" + req.params.data, "i") },
        ],
      });

      //firstname: new RegExp('^' + req.params.data, 'i')
      if (searchResult) {
        res.status(200).json(searchResult);
      } else {
        res.status(400).json({ message: "No results" });
        throw new Error("No results");
      }
    } catch (error) {
      console.log("error", error);
    }
  }),

  //logout auth
  authState: asyncHandler(async (req, res) => {
    console.log("logout", req.users);
    res.status(200).json({ message: "logout authentication successfull" });
  }),

  //login auth
  userLoginAuth: asyncHandler(async (req, res) => {
    console.log("login", req.users);
    res.status(200).json({ messsage: "login auth success" });
  }),

  ///like post
  postLike: asyncHandler(async (req, res) => {
    console.log(req.body);
    let userId = mongoose.Types.ObjectId(req.body.userid);
    let postid = mongoose.Types.ObjectId(req.body.postid);
    let likedUser = await postModel.findOne({ _id: postid, likes: [userId] });
    if (likedUser) {
      let unlike = await postModel
        .findOneAndUpdate(
          { _id: postid },
          {
            $pull: { likes: [userId] },
          }
        )
        .populate("userId");
      res.status(200).json({ unlike, message: "unliked" });
    } else {
      let liked = await postModel
        .findByIdAndUpdate(
          { _id: postid },
          {
            $push: { likes: [userId] },
          }
        )
        .populate("userId");
      res.status(200).json({ liked, message: "liked" });
    }
  }),

  ///add cover image
  addCoverImage: asyncHandler(async (req, res) => {
    let coverimage = req.body.coverimage;
    let userid = mongoose.Types.ObjectId(req.user._id);
    if (!coverimage) {
      res.json({ message: "please select an image" });
      throw new Error("No image is selected");
    } else {
      let user = await userModel.findOne({ _id: userid });
      if (user.coverimage.length > 0) {
        let removedCover = await userModel.updateOne(
          { _id: userid },
          { $unset: { coverimage } }
        );
        let addedCover = await userModel.updateOne(
          { _id: user },
          {
            $push: {
              coverimage: coverimage,
            },
          }
        );
        res.json(addedCover);
      } else {
        let addedCover = await userModel.updateOne(
          { _id: user },
          {
            $push: {
              coverimage: coverimage,
            },
          }
        );
        res.json(addedCover);
      }
    }
  }),

  ///add profile image
  addProfileImg: asyncHandler(async (req, res) => {
    const profileimage = req.body.profileimage;
    const userid = mongoose.Types.ObjectId(req.user._id);
    if (!profileimage) {
      res.json({ message: "Add an image" });
      throw new Error("No image found");
    } else {
      const user = await userModel.findOne({ _id: userid });
      if (user.profileimage.length > 0) {
        const removedProfile = await userModel.updateOne(
          { _id: userid },
          { $unset: { profileimage } }
        );
        let addedProfile = await userModel.updateOne(
          { _id: user },
          {
            $push: {
              profileimage: profileimage,
            },
          }
        );
        res.json(addedProfile);
      } else {
        let addedProfile = await userModel.updateOne(
          { _id: user },
          {
            $push: {
              profileimage: profileimage,
            },
          }
        );
        res.json(addedProfile);
      }
    }
  }),

  ///get all users exept loggined user and followed user
  allUsers: asyncHandler(async (req, res) => {
    try {
      const logginedUser = mongoose.Types.ObjectId(req.user._id);
      const allUsers = await userModel.find({ _id: { $ne: logginedUser } });

      if (allUsers) {
        const exceptFollowing = await userModel.find({
          $and: [
            { _id: { $ne: logginedUser } },
            { followers: { $nin: [logginedUser] } },
          ],
        });

        const following = await userModel.find({
          followers: { $in: [logginedUser] },
        });

        const followers = await userModel.find({
          following: { $in: [logginedUser] },
        });
        res
          .status(200)
          .json({ allUsers, exceptFollowing, following, followers });
      } else {
        res.json({ message: "no users found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error found" });
    }
  }),

  ///add follow
  addFollow: asyncHandler(async (req, res) => {
    try {
      //alen loginded user
      //aswanth option user
      const acceptingUser = mongoose.Types.ObjectId(req.body.id);
      const user = mongoose.Types.ObjectId(req.user._id);
      const following = await userModel.updateOne(
        { _id: user },
        {
          $push: {
            following: [acceptingUser],
          },
        }
      );
      console.log("follow", following);
      const follower = await userModel.updateOne(
        { _id: acceptingUser },
        {
          $push: {
            followers: [user],
          },
        }
      );
      console.log("followed by", follower);
      res.status(200).json({ following, follower });
    } catch (error) {
      console.log("erroere", error);
    }
  }),

  ///unfollowing
  unFollow: asyncHandler(async (req, res) => {
    try {
      let logginedUser = mongoose.Types.ObjectId(req.user._id);
      let unfollowedUser = mongoose.Types.ObjectId(req.body.id);
      let removeInFollowing = await userModel.updateOne(
        { _id: logginedUser },
        {
          $pull: {
            following: unfollowedUser,
          },
        }
      );
      let removeInFollower = await userModel.updateOne(
        { _id: unfollowedUser },
        {
          $pull: {
            followers: logginedUser,
          },
        }
      );
      console.log(removeInFollower);
      res.status(200).json(removeInFollowing);
    } catch (error) {
      console.log(error);
    }
  }),

  ///remove followers
  removeFollowers: asyncHandler(async (req, res) => {
    try {
      const logginedUser = mongoose.Types.ObjectId(req.user._id);
      const removingUser = mongoose.Types.ObjectId(req.body.id);
      const userRemoveResult = await userModel.updateOne(
        { _id: logginedUser },
        {
          $pull: {
            followers: removingUser,
          },
        }
      );
      const removeResult = await userModel.updateOne(
        { _id: removingUser },
        {
          $pull: {
            following: logginedUser,
          },
        }
      );
      res.status(200).json(removeResult);
    } catch (error) {
      console.log(error);
    }
  }),
};
