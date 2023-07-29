import * as userService from "./service";
import { type NextFunction, type Request, type Response } from "express";

export async function fetchUsersPaginated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let {
      pageSize = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    sortBy = String(sortBy);
    sortOrder = String(sortOrder);
    page = parseInt(String(page));
    pageSize = parseInt(String(pageSize));

    const { totalUser, users } = await userService.fetchUsersPaginated({
      pageSize,
      page,
      sortBy,
      sortOrder,
    });

    return res.send({
      status: "success",
      data: {
        totalUser,
        users,
        page,
        pageSize,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const user = await userService.getUser(id);

    return res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
