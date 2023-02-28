const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    depth: {
      type: Number,
      default: 1,
    },
    parentId: {
      type: String,
      default: null,
    },
    author: {
      // Username
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comments", commentSchema);

module.exports = Comment;
