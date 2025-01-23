const express = require("express");
const passport = require("passport");
const authRouter = express.Router();
require("../auth/index");

const authController = require("../controller/auth.controller");

authRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  authController.signup
);

authRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  authController.login
);

module.exports = authRouter;