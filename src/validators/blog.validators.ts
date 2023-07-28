import Joi from "joi";

export const createBlogValidator = Joi.object({
  title: Joi.string().required().min(10),
  excerpt: Joi.string().min(10),
  content: Joi.string().required().min(100).max(50000),
  tags: Joi.array()
    .items(Joi.string().required().min(3).max(30))
    .required()
    .min(2),
}).required();

export const idValidator = Joi.string().required().min(10);

export const getBlogsValidator = Joi.object({
  search: Joi.string().empty().allow(null, ""),
  tag: Joi.string().empty().allow(null, ""),
  authorId: Joi.string().empty(),
  pageSize: Joi.number().min(3).max(40),
  page: Joi.number().min(1),
  sortBy: Joi.string().valid(
    "createdAt",
    "updatedAt",
    "likeCount",
    "commentCount"
  ),
  sortOrder: Joi.string().valid("asc", "desc"),
});
