import followerModel from "../database/follower.model";
import userModel from "../database/user.model";
import { follow as followUserOrTag } from "../services/followers.service";

export async function follow(req, res, next) {
  try {
    const { user } = req;

    const { followingUserId, tagName } = req.body;

    try {
      let messgae = await followUserOrTag({ user, followingUserId, tagName });
    } catch (err) {}

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User not logged in",
      });
    }

    const followingUser = await userModel.findById(followingUserId);

    if (!followingUser) {
      return res.status(404).send({
        status: "error",
        message: "User to follow does not exist",
      });
    }

    const alreadyFollow = await followerModel.findOne({
      "follower._id": user._id,
      "following._id": followingUser._id,
    });

    if (alreadyFollow) {
      return res.status(400).send({
        status: "error",
        message: `You already follow ${followingUser.name}.`,
      });
    }

    await followerModel.create({
      follower: {
        _id: user._id,
        name: user.name,
        image: user.image,
      },
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

    return res.status(200).send({
      status: "success",
      message: `You are now following ${followingUser.name}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function unfollow(req, res, next) {
  try {
    const { user } = req;

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User not logged in",
      });
    }

    const { followingId } = req.params;

    const followingUser = await userModel.findById(followingId);

    if (!followingUser) {
      return res.status(404).send({
        status: "error",
        message: "Following user does not exist",
      });
    }

    await followerModel.findOneAndDelete({
      "follower._id": user._id,
      "following._id": followingUser._id,
    });

    await userModel.findByIdAndUpdate(followingUser._id, {
      $inc: {
        followerCount: -1,
      },
    });

    await userModel.findByIdAndUpdate(user._id, {
      $inc: {
        followingCount: -1,
      },
    });

    return res.status(200).send({
      status: "success",
      message: `You are not following ${followingUser.name} anymore`,
    });
  } catch (err) {
    next(err);
  }
}

export async function followers(req, res, next) {
  try {
    const { userId } = req.params;

    const followers = await followerModel.find({
      "following._id": userId,
    });

    return res.status(200).send({
      status: "success",
      data: followers,
    });
  } catch (err) {
    next(err);
  }
}

export async function following(req, res, next) {
  try {
    const { userId } = req.params;

    const following = await followerModel.find({
      "follower._id": userId,
    });

    return res.status(200).send({
      status: "success",
      data: following,
    });
  } catch (err) {
    next(err);
  }
}
