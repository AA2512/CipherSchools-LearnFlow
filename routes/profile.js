const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const { ensureNewUser, ensureSignUp } = require("../middleware/user");
const { getAllPosts } = require("../middleware/dashboard");

const User = require("../models/User");

//Cloudinary Config
cloudinary.config({
  cloud_name: "djtqk69w2",
  api_key: "988281195666512",
  api_secret: "gAYRXw0injArpakh9jIdPjt2etM",
});

router.get("/profile", ensureAuth, ensureSignUp, (req, res) => {
  res.render("profile-settings");
});

router.patch("/update/profile", ensureAuth, ensureSignUp, async (req, res) => {
  const user = req.user;

  try {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.displayName = req.body.displayName;
    user.phone = req.body.phone;
    user.about = req.body.about;
    user.gender = req.body.gender;
    await user.save();

    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
});

router.patch("/update/avatar", ensureAuth, ensureSignUp, async (req, res) => {
  const user = req.user;
  const key = req.body.key;
  console.log(req.body);
  user.image = "https://my-video-bucket-123.s3.ap-south-1.amazonaws.com/" + key;
  await user.save();
  res.status(200).send();
});

router.patch("/update/cover", ensureAuth, ensureSignUp, async (req, res) => {
  const user = req.user;
  const key = req.body.key;
  console.log(req.body);
  user.cover = "https://my-video-bucket-123.s3.ap-south-1.amazonaws.com/" + key;
  await user.save();
  res.status(200).send();
});

// router.get(
//   "/profile/:username",
//   ensureAuth,
//   ensureSignUp,
//   getPostsByUsername,
//   async (req, res) => {
//     const username = req.params.username;
//     res.locals.user = req.user;
//     const user = await User.findOne({ username });
//     console.log(user);
//     if (!user) return res.render("error-404");
//     res.locals.publicProfile = {
//       displayName: user.displayName,
//       username: user.username,
//       image: user.image,
//       about: user.about,
//       skills: user.skills,
//     };
//     res.render("public-profile");
//   }
// );

module.exports = router;
