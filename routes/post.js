const express = require("express");
const Post = require("../models/Post");
const cloudinary = require("cloudinary");
const User = require("../models/User");
const Like = require("../models/Like");
const moment = require("moment");
const { fetchCommentsByPostId } = require("../middleware/comment");

const { ensureGuest, ensureAuth } = require("../middleware/auth");
const { ensureCreator } = require("../middleware/user");
const View = require("../models/View");
const router = express.Router();

//Cloudinary Config
cloudinary.config({
  cloud_name: "djtqk69w2",
  api_key: "988281195666512",
  api_secret: "gAYRXw0injArpakh9jIdPjt2etM",
});

// All the routes are automatically prefixed by /post

router.get("/:id", ensureAuth, async (req, res) => {
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

router.get("/edit/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const post = await Post.findById(postID);

      res.locals.post = post;
      res.render("edit-post");
    } catch (err) {
      res.render("error-not-allowed");
    }
  } else {
    res.render("error-404");
  }
});

router.patch("/edit/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const post = await Post.findById(postID);

      post.title = req.body.title;
      post.cover = req.body.cover;
      post.tags = req.body.tags;
      post.innerHTML = req.body.innerHTML;

      await post.save();
      res.status(200).json({
        id: post._id,
      });
    } catch (err) {
      res.status(400).json({
        error: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      err: "Not Allowed",
    });
  }
});

router.delete("/delete/:id", ensureAuth, async (req, res) => {
  const postID = req.params.id.toString();
  const user = req.user;
  const id = user.posts.indexOf(postID);
  if (id != -1) {
    try {
      const deletionInfo = await Post.findByIdAndDelete(postID);
      console.log(deletionInfo);
      res.status(200).json({
        deleted: 1,
      });
    } catch (err) {
      res.status(400).json({
        error: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      err: "Not Allowed",
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
