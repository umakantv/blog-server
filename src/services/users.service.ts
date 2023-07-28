import { isValidObjectId } from "mongoose";
import userModel from "../database/user.model";
import AppError from "../utils/AppError";

export async function fetchUsersPaginated({
  pageSize = 10,
  page = 1,
  sortBy = "createdAt",
  sortOrder = "desc",
}) {
  const totalUser = await userModel.find().count();

  const users = await userModel
    .find()
    .select("-password")
    .sort({
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  return {
    totalUser,
    users,
    page,
    pageSize,
  };
}

export async function getUser(idOrUsername) {
  let user;

  if (isValidObjectId(idOrUsername)) {
    user = await userModel.findById(idOrUsername);
  } else {
    user = await userModel.findOne({
      username: idOrUsername,
    });
  }

  if (user) {
    user = user.toJSON();

    delete user.password;

    return user;
  } else {
    throw new AppError("User with the given id or username does not exist.");
  }
}
