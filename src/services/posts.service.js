const postModel = require("../database/post.model");
const userModel = require("../database/user.model");
const { createSlug } = require("../utils");
const AppError = require("../utils/AppError");
const { validate } = require("../validators");
const {
  getBlogsValidator,
  createBlogValidator,
  idValidator,
} = require("../validators/blog.validators");
const { addTags } = require("./tags.service");

async function getPosts({
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

async function createPost(post, user) {
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

  let tags = [...new Set(post.tags.filter((tag) => tag !== ""))];
  tags = tags.map((tag) => createSlug(tag));
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

async function getPostBySlug(slug) {
  validate(idValidator, slug);

  return postModel.findOne({
    slug,
  });
}

module.exports = {
  getPosts,
  createPost,
  getPostBySlug,
};
