const express = require("express");
const authController = require("../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.get("/loggedInUser", authController.getLoggedInUser);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/github-signin/:code", authController.githubSignin);
authRouter.get(
  "/username_available/:username",
  authController.checkUsernameAvailable
);

module.exports = authRouter;
