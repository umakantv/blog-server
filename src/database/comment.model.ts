import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 10,
    },
    author: {
      _id: String,
      username: String,
      name: String,
      image: String,
    },
    postId: String,
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const commentsModel = mongoose.model("comments", commentSchema); // commentss

export default commentsModel;
