import commentsModel from "./repo";
import postModel from "../Post/repo";
import { ContextUser } from "../../types/User";

export async function getPostComments(postId: string) {
  return commentsModel
    .find({
      postId,
    })
    .sort({
      createdAt: -1,
    });
}

export async function createComment(comment, user: ContextUser) {
  comment.author = {
    _id: user._id,
    name: user.name,
    image: user.image,
  };

  if (!comment.blogId) {
    throw new Error("Blog id is not provided");
  }

  const commentData = await commentsModel.create(comment);

  // https://www.mongodb.com/docs/manual/reference/operator/update/inc/#example
  await postModel.findByIdAndUpdate(comment.blogId, {
    $inc: {
      commentCount: 1,
    },
  });

  return commentData;
}
