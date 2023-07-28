import postModel from "../database/post.model";
import userModel from "../database/user.model";
import { createSlug } from "../utils";
import AppError from "../utils/AppError";
import { validate } from "../validators";
import {
  getBlogsValidator,
  createBlogValidator,
  idValidator,
} from "../validators/blog.validators";
import { addTags } from "./tags.service";

export async function getPosts({
  search,
  tag,
  pageSize,
  page,
  sortBy,
  sortOrder,
  authorId,
}) {
  validate(getBlogsValidator, {
    search,
    tag,
    pageSize,
    page,
    sortBy,
    sortOrder,
    authorId,
  });

  try {
    const filter = {
      title: {
        $regex: search,
      },
    };

    if (authorId) {
      filter["author._id"] = authorId;
    }

    if (tag) {
      filter["tags"] = {
        $elemMatch: {
          $eq: tag,
        },
      };
    }

    const [totalBlogs, blogs] = await Promise.all([
      postModel.find(filter).count(),
      postModel
        .find(filter)
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .limit(pageSize)
        .skip(pageSize * (page - 1)),
    ]);

    return {
      totalBlogs,
      blogs,
      page,
      pageSize,
    };
  } catch (err) {
    console.error(err);

    throw new AppError("Something went wrong", 500);
  }
}

export async function createPost(
  post: {
    title: string;
    content: string;
    tags: string[];
    excerpt?: string;
    slug?: string;
    author?: any;
  },
  user
) {
  validate(createBlogValidator, post);

  if (!user) {
    throw new AppError("User not logged in", 401);
  }

  post.author = {
    _id: user._id,
    name: user.name,
    username: user.username,
    image: user.image,
  };

  post.slug = createSlug(post.title) + "-" + Date.now().toString();

  let tags = Array.from(new Set(post.tags.filter((tag: string) => tag !== "")));
  tags = tags.map((tag: string) => createSlug(tag));
  await addTags(tags);
  post.tags = tags;

  let { excerpt } = post;

  if (!excerpt) {
    excerpt = post.content.split("\n")[0];
    if (excerpt.split(" ").length > 100) {
      excerpt = post.content.split(" ").slice(0, 50).join(" ");
    }
    post.excerpt = excerpt;
  }

  const createdPost = await postModel.create(post);

  // No need to await this
  userModel
    .findByIdAndUpdate(user._id, {
      $inc: {
        postsCount: 1,
      },
    })
    .then(() => {});

  return createdPost;
}

export async function getPostBySlug(slug) {
  validate(idValidator, slug);

  return postModel.findOne({
    slug,
  });
}
