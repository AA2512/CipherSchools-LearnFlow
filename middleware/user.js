const User = require("../models/User");

const ensureSignUp = (req, res, next) => {
  const user = req.user;
  if (user.role === 0 || user.role === 1) return next();
  res.redirect("/signup/info");
  next();
};

const ensureNewUser = (req, res, next) => {
  const user = req.user;
  if (user.role === 0 || user.role === 1) return res.redirect("/dashboard");
  next();
};

const ensureCreator = (req, res, next) => {
  const user = req.user;
  if (user.role === 0) return next();
  return res.redirect("/dashboard");
};

module.exports = {
  ensureNewUser,
  ensureSignUp,
  ensureCreator,
};
