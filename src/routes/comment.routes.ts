import express from "express";
import * as commentController from "../models/Comment/controller";

const commentRouter = express.Router();

commentRouter.get("/blog/:id", commentController.getCommentsByPostId);
commentRouter.post("/", commentController.createComment);
commentRouter.patch("/:id", commentController.editComment);
commentRouter.delete("/:id", commentController.deleteComment);

export default commentRouter;
