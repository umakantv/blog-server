import express, { Express } from "express";
import postRouter from "./post.routes";
import userRouter from "./user.routes";
import commentRouter from "./comment.routes";
import followerRouter from "./following.routes";
import likeRouter from "./like.routes";
import authRouter from "./auth.routes";

export default function initiateRoutes(app: Express) {
  // Static file server
  app.use(express.static("public"));

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/comments", commentRouter);
  app.use("/api/follows", followerRouter);
  app.use("/api/likes", likeRouter);

  app.get("/", (req, res) => {
    res.send({
      status: "success",
      message: "Hey there",
    });
  });

  app.get("/health", (req, res) => {
    res.send({
      status: "success",
      message: "healthy",
    });
  });
}
