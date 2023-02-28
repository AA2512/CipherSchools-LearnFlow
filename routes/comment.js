const Comment = require("../models/Comment");
const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const { fetchCommentsByParentId } = require("../middleware/comment");
const router = express.Router();

router.post("/add", ensureAuth, async (req, res) => {
  const commentText = req.body.commentText;
  const postId = req.body.postId;
  const author = req.user.displayName;
  const authorImage = req.user.image;
  const depth = Number(req.body.depth);
  let parentId = req.body.parentId;
  if (parentId == "null") parentId = null;

  try {
    const comment = await Comment.create({
      postId,
      depth,
      author,
      authorImage,
      parentId,
      commentText,
    });
    console.log(comment);
    res.status(200).json({
      _id: comment._id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong!",
    });
  }
});

router.get("/threads", ensureAuth, async (req, res) => {
  const parentId = req.query.parentId;
  const parentDepth = Number(req.query.parentDepth);
  try {
    const comments = await fetchCommentsByParentId(parentId, parentDepth + 1);
    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong",
    });
  }
});

module.exports = router;
