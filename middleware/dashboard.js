const Post = require("../models/Post");
const User = require("../models/User");

const getAllPosts = async (req, res, next) => {
  const user = req.user;

  const posts = await Post.find({});

  res.locals.posts = posts;

  next();
};

module.exports = {
  getAllPosts,
};
