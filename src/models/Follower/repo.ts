import mongoose from "mongoose";

/**
 * Looking at the Cardinality for set {follower, following}
 *
 * A User can easily have millions of followers.
 * But it is very difficult to follow a million people.
 */
const followerSchema = new mongoose.Schema(
  {
    follower: {
      _id: String,
      name: String,
      image: String,
    },
    followingEntityType: {
      type: String,
      enum: ["user", "tag"],
    },
    tag: {
      name: String,
    },
    user: {
      _id: String,
      name: String,
      image: String,
    },
    createdAt: Date,
  },
  {
    timestamps: true,
  }
);

const followerModel = mongoose.model("followers", followerSchema);

export default followerModel;
