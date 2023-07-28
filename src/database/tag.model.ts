import mongoose from "mongoose";

/**
 * Each tag is created along with a post for the first time
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const tagModel = mongoose.model("tags", tagSchema);

export default tagModel;
