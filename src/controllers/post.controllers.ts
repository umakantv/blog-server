import {
  getPosts,
  createPost as addPost,
  getPostBySlug as getSinglePost,
} from "../services/posts.service";

export async function getPostsPaginated(req, res, next) {
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

export async function createPost(req, res, next) {
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

export async function getPostById(req, res, next) {
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
