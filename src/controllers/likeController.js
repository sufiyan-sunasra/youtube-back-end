import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likeModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweetModel.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video ID");
  }

  let like = await Like.findOne({ video: videoId, likedBy: userId });

  if (like) {
    await Like.findByIdAndDelete(like._id);

    return res.status(200).json(new ApiResponse(200, "video like removed"));
  } else {
    like = new Like({ video: videoId, likedBy: userId });

    await like.save();

    return res
      .status(200)
      .json(new ApiResponse(200, like, "video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment ID");
  }

  let comment = await Comment.findOne({ comment: commentId, likedBy: userId });

  if (comment) {
    await Comment.findByIdAndDelete(comment._id);
    return res.status(200).json(new ApiResponse(200, "comment like removed"));
  } else {
    comment = new Comment({ comment: commentId, likedBy: userId });
    await comment.save();
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet ID");
  }

  let tweet = await Tweet.findOne({ tweet: tweetId, likedBy: userId });

  if (tweet) {
    await Tweet.findByIdAndDelete(tweet._id);

    return res.status(200).json(new ApiResponse(200, "tweet like removed"));
  } else {
    tweet = new Tweet({ tweet: tweetId, likedBy: userId });

    await tweet.save();

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all likes related to videos by the user
  const likes = await Like.find({ likedBy: userId, video: { $ne: null } })
    .populate("video", "title description") // Adjust fields as necessary
    .exec();

  if (!likes.length) {
    return res.status(404).json(new ApiError(404, "No liked videos found"));
  }

  // Extract video information
  const likedVideos = likes.map((like) => like.video);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
