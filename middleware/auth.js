module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
      return next();
    } else {
      res.redirect("/");
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
