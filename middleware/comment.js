const Comment = require("../models/Comment");

const fetchCommentsByPostId = async (postId, depth) => {
  const comments = await Comment.find({ postId, depth });
  console.log(comments);
  return comments;
};

const fetchCommentsByParentId = async (parentId, depth) => {
  const comments = await Comment.find({ parentId, depth });
  console.log(comments);
  return comments;
};

module.exports = { fetchCommentsByPostId, fetchCommentsByParentId };
