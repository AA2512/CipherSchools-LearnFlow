const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const moment = require("moment");
const { fetchCommentsByPostId } = require("../middleware/comment");

const { ensureGuest, ensureAuth } = require("../middleware/auth");
const { ensureCreator } = require("../middleware/user");
const View = require("../models/View");
const router = express.Router();

// All the routes are automatically prefixed by /post

router.get("/:id", async (req, res) => {
  if (!req.isAuthenticated())
    return res.redirect(`/post/public/${req.params.id}`);
  res.locals.user = req.user;
  const id = req.params.id;
  const post = await Post.findById(id);
  const creator = await User.findOne({ googleID: post.userID });
  const comments = await fetchCommentsByPostId(id, 1);
  let likeDoc = await Like.findOne({ userID: post.userID, postID: id });
  let like = false;
  if (likeDoc) like = true;
  res.locals.liked = like;

  let viewDoc = await View.findOne({ userID: post.userID, postID: id });
  let view = false;
  if (viewDoc) view = true;
  res.locals.viewed = view;

  res.locals.post = post;
  res.locals.postID = id.toString();
  res.locals.creator = creator;
  res.locals.comments = comments;

  let m = moment(post.createdAt);
  res.locals.createdDate = m.format("dddd, MMMM Do YYYY");

  res.render("post-new");
});

router.get("/public/:id", async (req, res) => {
  if (req.isAuthenticated()) return res.redirect(`/post/${req.params.id}`);
  const id = req.params.id;
  const post = await Post.findById(id);
  console.log(post);
  const creator = await User.findOne({ googleID: post.userID });
  console.log(creator);
  res.locals.post = post;
  res.locals.postID = id.toString();
  res.locals.creator = creator;

  let m = moment(post.createdAt);
  res.locals.createdDate = m.format("dddd, MMMM Do YYYY");

  res.render("public-post");
});

router.get("/create/new", ensureAuth, ensureCreator, (req, res) => {
  res.render("create-post");
});

router.post("/create/new", ensureAuth, ensureCreator, async (req, res) => {
  try {
    const user = req.user;

    const newPost = {
      userID: req.user.googleID,
      title: req.body.title,
      description: req.body.description,
      thumbnailKey:
        "https://my-video-bucket-123.s3.ap-south-1.amazonaws.com/" +
        req.body.thumbnailKey,
      videoKey:
        "https://my-video-bucket-123.s3.ap-south-1.amazonaws.com/" +
        req.body.videoKey,
    };

    const post = await Post.create(newPost);
    console.log(post);
    res.status(200).json({
      id: post._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Something went wrong.",
    });
  }
});

router.patch("/like", ensureAuth, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    post.likes += 1;
    await post.save();
    const like = await Like.create({
      userID: req.user.googleID,
      postID: id,
    });
    console.log(like);
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});

router.patch("/view", ensureAuth, async (req, res) => {
  const id = req.body.id;
  try {
    const post = await Post.findById(id);
    post.views += 1;
    await post.save();
    const view = await View.create({
      userID: req.user.googleID,
      postID: id,
    });
    console.log(view);
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({});
  }
});

module.exports = router;
