const passport = require("passport");
const localStratergy = require("passport-local").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const jwtStratergy = require("passport-jwt").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

require("dotenv").config();

passport.use(
  "signup",
  new localStratergy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create({
          ...req.body,
          password: await bcrypt.hash(req.body.password, 12),
        });
        user.password = "";

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStratergy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await bcrypt.compare(password, user.password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new jwtStratergy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);