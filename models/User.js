const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
  displayName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  role: {
    type: Number, // 0-> Creator, 1-> Student
  },
  about: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "../../img/custom/Robot_Avatar.jpg",
  },
  cover: {
    type: String,
    default: "../../img/theme/light/code-1.jpg",
  },
  gender: {
    type: String,
    default: "",
  },
  birthdate: {
    type: String,
  },
  phone: {
    type: String,
    default: "+91 1234567890",
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
