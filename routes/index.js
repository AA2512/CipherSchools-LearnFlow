const express = require("express");

const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { getAllPosts } = require("../middleware/posts");
const { ensureNewUser, ensureSignUp } = require("../middleware/user");

//@desc Login
//@route GET /

router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/signup/info", ensureAuth, ensureNewUser, (req, res) => {
  res.render("signup-profile");
});

router.get("/dashboard", ensureAuth, ensureSignUp, getAllPosts, (req, res) => {
  res.locals.user = req.user;
  res.render("dashboard");
});

router.get("/signup/profile", ensureAuth, (req, res) => {
  if (req.user.username && req.user.username.length > 0)
    return res.redirect("/dashboard");
  res.render("signup-profile");
});

module.exports = router;
