import mongoose from "mongoose";

// Step 2. Define the Schema
const userSchema = new mongoose.Schema({
  name: String, // candidate for profile
  gender: {
    // candidate for profile
    type: String,
    enum: ["male", "female", "other"],
  },
  image: String,
  about: String, // candidate for profile
  coverImage: String, // candidate for profile
  username: String, // candidate for profile
  githubUsername: String,
  authType: {
    type: String,
    enum: ["github", "google", "facebook", "email-password"],
    default: "email-password",
  },
  email: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: {
    type: Object,
    childSchemas: {
      otp: String,
      validTill: Date,
    },
    select: false,
  },
  resetPasswordOtp: {
    type: Object,
    childSchemas: {
      otp: String,
      validTill: Date,
    },
    select: false,
  },
  password: {
    type: String,
    minLength: 8,
    select: false,
  },
  postsCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  followerCount: {
    type: Number,
    default: 0,
  },
});

// Step 3. Create a model using the schema related to the collection
const userModel = mongoose.model("users", userSchema); // users

export default userModel;
