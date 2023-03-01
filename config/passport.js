const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { googleClientID, googleClientSecret } = require("./keys");

//Moment JS
const moment = require("moment");
moment().format();

let callbackURL = "https://learnflow.link/auth/google/callback"; // Change
if (process.env.NODE_ENV === "development") {
  callbackURL = "/auth/google/callback";
}

//Passport Strategy Configuration
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const stDate = 1641124800000;
        const weekN = Math.round(
          (moment(Date.now()).startOf("week") - stDate) /
            (1000 * 60 * 60 * 24 * 7)
        );
        const newUser = {
          googleID: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
        };

        try {
          // Check if user already exists
          let user = await User.findOne({ email: newUser.email });
          if (user) {
            user.googleID = newUser.googleID;
            user.image = newUser.image;
            await user.save();

            done(null, user);
          } else {
            user = await User.create(newUser);

            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
