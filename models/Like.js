const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  postID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = mongoose.model("Like", LikeSchema);
