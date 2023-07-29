import postModel from "../Post/repo";
import commentsModel from "../Comment/repo";
import { type NextFunction, type Request, type Response } from "express";

// TODO
/**
 * Add a like to a blog or a comment
 *
 * Request will have either of the query params: blogId or commentId
 *
 * User must be logged in
 * We must not add duplicate likes
 */
export async function like(req: Request, res: Response, next: NextFunction) {}

// TODO
/**
 * Remove a like from blog or comment
 *
 * Request will have either of the query params: blogId or commentId
 *
 * User must be logged in
 */
export async function removeLike(
  req: Request,
  res: Response,
  next: NextFunction
) {}

// TODO
/**
 * Get all like on a blog or comment
 *
 * Request will have either of the query params: blogId or commentId
 */
export async function getAllLikes(
  req: Request,
  res: Response,
  next: NextFunction
) {}
