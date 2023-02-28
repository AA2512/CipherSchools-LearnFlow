const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  userID: {
    type: String,
    required: true,
  },
  thumbnailKey: {
    type: String,
    required: true,
  },
  videoKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Video", VideoSchema);
