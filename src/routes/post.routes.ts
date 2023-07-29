import express from "express";
import * as postController from "../models/Post/controller";

const blogRouter = express.Router();

blogRouter.post("/", postController.createPost);
blogRouter.get("/:id", postController.getPostById);
blogRouter.get("/", postController.getPostsPaginated);

export default blogRouter;
