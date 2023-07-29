import { type NextFunction, type Request, type Response } from "express";
import {
  getPosts,
  createPost as addPost,
  getPostBySlug as getSinglePost,
} from "./service";
import { RequestContext } from "../../types/Context";

export async function getPostsPaginated(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {
  try {
    let {
      search = "",
      tag = "",
      pageSize = 10,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
      authorId,
    } = req.query;

    const { totalBlogs: totalRecords, blogs: records } = await getPosts({
      search,
      tag,
      pageSize,
      page,
      sortBy,
      sortOrder,
      authorId,
    });

    return res.send({
      status: "success",
      data: {
        totalRecords,
        records,
        page,
        pageSize,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createPost(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {
  let { body: postData, user } = req;

  try {
    let post = await addPost(postData, user);

    return res.send({
      status: "success",
      data: post,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    let post = await getSinglePost(id);

    return res.send({
      status: "success",
      data: post,
    });
  } catch (err) {
    next(err);
  }
}
