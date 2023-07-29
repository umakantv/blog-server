import express from "express";
import * as userController from "../models/User/controller";

const userRouter = express.Router();

userRouter.get("/all", userController.fetchUsersPaginated);
userRouter.get("/:id", userController.fetchUser);

export default userRouter;
