const express = require("express");
const passport = require("passport");
const router = express.Router();

//@desc Login
//@route GET /

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    const user = req.user;
    console.log(user);
    if (user.role != 0 || user.role != 1) {
      return res.redirect("/signup/info");
    }
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
