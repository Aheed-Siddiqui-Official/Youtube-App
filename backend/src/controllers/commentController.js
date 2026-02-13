import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createComment = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "You must be logged in to comment");
  }

  const { content, videoId } = req.body;

  if (!content?.trim() || !videoId) {
    throw new ApiError(400, "All fields are required");
  }

  const newComment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment created successfully"));
});

export const getComment = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ video: req.params.id })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "owner",
        select: "username avatar fullName", // only safe fields
      },
      {
        path: "video",
        select: "title thumbnail duration", // adjust as needed
      },
    ])
    .sort({ createdAt: -1 })
    .lean();

  // console.log("Fetched comments with owner:", comments?.[0]?.owner);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  // CHECK COMMENT

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  // DELETE COMMENT

  await Comment.findByIdAndDelete(comment?._id);

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // CHECK COMMENT

  if (!content?.trim()) {
    throw new ApiError(404, "Comment not found");
  }

  // UPDATE COMMENT

  const comment = await Comment.findById(req.params.id);
  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content: content.trim() },
    { new: true }
  );

  // RETURN RESPONSE

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

export const likeComment = asyncHandler(async (req, res) => {
  if (!req?.user?._id) {
    throw new ApiError(401, "You are not authenticated");
  }

  // GET COMMENT

  const comment = await Comment.findById(req.params.id);

  // VALIDATION FOR COMMENT

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // CHECK IF USER ALREADY LIKED THE COMMENT

  const isLiked = comment?.likes?.includes(req?.user?._id);

  const likedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      [isLiked ? "$pull" : "$push"]: { likes: req?.user?._id },
    },
    { new: true }
  );

  // VALIDATED COMMENT

  if (!likedComment) {
    throw new ApiError(500, "Failed to like comment");
  }

  // RETURN RESPONSE

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedComment,
        isLiked ? "Comment disliked successfully" : "Comment liked successfully"
      )
    );
});
