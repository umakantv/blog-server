import followerModel from "./repo";
import tagModel from "../Tag/repo";
import AppError from "../../utils/AppError";
import userModel from "../User/repo";

export async function follow({ user, followingUserId, tagName }) {
  if (!user) {
    throw new AppError("User not logged in", 400);
  }

  if (followingUserId) {
    return followUser(user, followingUserId);
  }

  if (tagName) {
    return followTag(user, tagName);
  }
}

export async function followUser(user, followingUserId) {
  const followingUser = await userModel.findById(followingUserId);

  if (!followingUser) {
    throw new AppError("User to follow does not exist", 404);
  }

  const alreadyFollow = await followerModel.findOne({
    "follower._id": user._id,
    followingEntityType: "user",
    "following._id": followingUser._id,
  });

  if (alreadyFollow) {
    throw new AppError(`You already follow ${followingUser.name}.`, 400);
  }

  await followerModel.create({
    follower: {
      _id: user._id,
      name: user.name,
      image: user.image,
    },
    followingEntityType: "user",
    following: {
      _id: followingUser._id,
      name: followingUser.name,
      image: followingUser.image,
    },
  });

  await userModel.findByIdAndUpdate(followingUser._id, {
    $inc: {
      followerCount: 1,
    },
  });

  await userModel.findByIdAndUpdate(user._id, {
    $inc: {
      followingCount: 1,
    },
  });

  return `You are now following ${followingUser.name}`;
}

export async function followTag(user, tagName) {
  const tag = await tagModel.findOne({ name: tagName });

  if (!tag) {
    throw new AppError("Tag to follow does not exist", 404);
  }

  const alreadyFollow = await followerModel.findOne({
    "follower._id": user._id,
    followingEntityType: "tag",
    "tag.name": tagName,
  });

  if (alreadyFollow) {
    throw new AppError(`You already follow ${tagName}.`, 400);
  }

  await followerModel.create({
    follower: {
      _id: user._id,
      name: user.name,
      image: user.image,
    },
    followingEntityType: "tag",
    tag: {
      name: tagName,
    },
  });

  await tagModel.updateOne(
    {
      name: tagName,
    },
    {
      $inc: {
        followerCount: 1,
      },
    }
  );

  return `You are now following ${tagName}`;
}

export async function unfollowUser(user, followingUserId) {
  const followingUser = await userModel.findById(followingUserId);

  if (!followingUser) {
    throw new AppError("User to unfollow does not exist", 404);
  }

  const alreadyFollow = await followerModel.findOne({
    "follower._id": user._id,
    followingEntityType: "user",
    "following._id": followingUser._id,
  });

  if (!alreadyFollow) {
    throw new AppError(`You don't follow ${followingUser.name}.`, 400);
  }

  await alreadyFollow.delete();

  await userModel.findByIdAndUpdate(followingUser._id, {
    $dec: {
      followerCount: 1,
    },
  });

  await userModel.findByIdAndUpdate(user._id, {
    $dec: {
      followingCount: 1,
    },
  });

  return `You are not following ${followingUser.name} anymore`;
}

export async function unfollowTag(user, tagName) {
  const alreadyFollow = await followerModel.findOne({
    "follower._id": user._id,
    followingEntityType: "tag",
    "tag.name": tagName,
  });

  if (!alreadyFollow) {
    throw new AppError(`You don't follow ${tagName}.`, 400);
  }

  await alreadyFollow.delete();

  await tagModel.updateOne(
    {
      name: tagName,
    },
    {
      $inc: {
        followerCount: 1,
      },
    }
  );

  return `You are not following ${tagName} anymore`;
}

export async function unfollow({ user, followingUserId, tagName }) {
  if (!user) {
    throw new AppError("User not logged in", 400);
  }

  if (followingUserId) {
    return unfollowUser(user, followingUserId);
  }

  if (tagName) {
    return unfollowTag(user, tagName);
  }
}

// Since followers can be in large number, we need to send response in a paginated form
export async function getFollowersPaginated(userId, skip, limit = 10) {
  if (limit > 100) {
    throw new Error("Limit must be within 100");
  }

  let followers = await followerModel
    .find({
      followingEntityType: "user",
      "following._id": userId,
    })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  return followers.map(({ follower, createdAt }) => ({ follower, createdAt }));
}

export async function getFollowing(userId, skip = 0, limit = 10) {
  let followers = await followerModel
    .find({
      followingEntityType: "user",
      "follower._id": userId,
    })
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  return followers.map(({ user, createdAt }) => ({
    following: user,
    createdAt,
  }));
}
