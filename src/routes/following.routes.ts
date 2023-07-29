import express from "express";
import {
  unfollow,
  follow,
  following,
  followers,
} from "../models/Follower/controller";

const followerRouter = express.Router();

followerRouter.get("/followers/:userId", followers);
followerRouter.get("/following/:userId", following);

// loggedin user actions
followerRouter.post("/:followingId", follow);
followerRouter.delete("/:followingId", unfollow);

export default followerRouter;
