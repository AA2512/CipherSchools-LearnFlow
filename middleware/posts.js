const Post = require("../models/Post");

const getAllPosts = async (req, res, next) => {
  const posts = await Post.find({});
  res.locals.posts = posts;
  next();
};

module.exports = {
  getAllPosts,
};
