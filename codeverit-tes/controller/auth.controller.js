// const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("dotenv").config({ path: ".env" });

const signup = async (req, res) => {
  const { id, email } = req.user;

  const token = jwt.sign({ user: { email, id } }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return await res.status(200).json({ user: req.user, token });
};

const login = async (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { id: user.id, email: user.email };

        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return res.status(200).json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

module.exports = {
  signup,
  login,
};
