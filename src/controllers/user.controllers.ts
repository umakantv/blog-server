import * as userService from "../services/users.service";

export async function fetchUsersPaginated(req, res, next) {
  try {
    const {
      pageSize = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

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

export async function fetchUser(req, res, next) {
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
