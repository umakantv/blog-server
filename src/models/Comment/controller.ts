import { RequestContext } from "../../types/Context";
import { type NextFunction, type Request, type Response } from "express";
import * as service from "./service";

export async function getCommentsByPostId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const comments = await service.getPostComments(id);

    return res.send({
      status: "success",
      data: comments,
    });
  } catch (err) {
    next(err);
  }
}

export async function createComment(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = req.body;
    const { user } = req;

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User not logged in",
      });
    }

    const commentData = await service.createComment(comment, user);

    return res.send({
      status: "success",
      data: commentData,
    });
  } catch (err) {
    next(err);
  }
}

// TODO
/**
 * Delete a comment from a post and decrease the comment count
 *
 * User must not be able to delete other users' comments
 */
export async function deleteComment(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {}

// TODO
/**
 * Edit comment content
 *
 * User must be able to edit only comments that are authored by him/her
 */
export async function editComment(
  req: RequestContext,
  res: Response,
  next: NextFunction
) {}
