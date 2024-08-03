import mongoose from "mongoose";
import { Comment } from "../models/commentModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    populate: [
      { path: "owner", select: "name" }, // assuming 'User' model has 'name' field
      { path: "video", select: "title" }, // assuming 'Video' model has 'title' field
    ],
  };

  const comments = await Comment.aggregatePaginate(
    Comment.find({ video: videoId }),
    options
  );

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user._id; // assuming userId is available in req.user

  const newComment = new Comment({
    content,
    video: videoId,
    owner: userId,
  });

  await newComment.save();

  res
    .status(201)
    .json(new ApiResponse("Comment added successfully", newComment));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }

  res
    .status(200)
    .json(new ApiResponse("Comment updated successfully", updatedComment));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }

  res
    .status(200)
    .json(new ApiResponse("Comment deleted successfully", deletedComment));
});

export { getVideoComments, addComment, updateComment, deleteComment };
