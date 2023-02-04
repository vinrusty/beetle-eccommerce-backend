const passport = require('passport');
const User = require('./models/User');
const dotenv = require('dotenv')

dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    scope: ["profile", "email"]
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, email: profile._json.email, username: profile._json.name, picture: profile._json.picture }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
})