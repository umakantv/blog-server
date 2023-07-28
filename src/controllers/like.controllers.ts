import postModel from "../database/post.model";
import commentsModel from "../database/comment.model";

// TODO
/**
 * Add a like to a blog or a comment
 *
 * Request will have either of the query params: blogId or commentId
 *
 * User must be logged in
 * We must not add duplicate likes
 */
export async function like(req, res) {}

// TODO
/**
 * Remove a like from blog or comment
 *
 * Request will have either of the query params: blogId or commentId
 *
 * User must be logged in
 */
export async function removeLike(req, res) {}

// TODO
/**
 * Get all like on a blog or comment
 *
 * Request will have either of the query params: blogId or commentId
 */
export async function getAllLikes(req, res) {}
