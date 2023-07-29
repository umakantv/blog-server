import express from "express";
import * as authController from "../models/Auth/controller";

const authRouter = express.Router();

authRouter.get("/loggedInUser", authController.getLoggedInUser);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/github-signin/:code", authController.githubSignin);
authRouter.get(
  "/username_available/:username",
  authController.checkUsernameAvailable
);

export default authRouter;
