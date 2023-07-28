import express from "express";
import {
  createPost,
  getPostsPaginated,
  getPostById,
} from "../controllers/post.controllers";

const blogRouter = express.Router();

blogRouter.post("/", createPost);
blogRouter.get("/:id", getPostById);
blogRouter.get("/", getPostsPaginated);

export default blogRouter;
