import express from "express";
import {
  createComment,
  getCommentsByPostId,
  editComment,
  deleteComment,
} from "../controllers/comment.controllers";

const commentRouter = express.Router();

commentRouter.get("/blog/:id", getCommentsByPostId);
commentRouter.post("/", createComment);
commentRouter.patch("/:id", editComment);
commentRouter.delete("/:id", deleteComment);

export default commentRouter;
