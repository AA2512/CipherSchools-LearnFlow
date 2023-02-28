const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.patch("/update/role", ensureAuth, async (req, res) => {
  const user = req.user;
  try {
    const role = Number(req.body.role);
    user.role = role;
    await user.save();
    res.status(200).json({
      status: "Done",
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
    });
  }
});

router.patch("/update/profile", ensureAuth, async (req, res) => {});

module.exports = router;
