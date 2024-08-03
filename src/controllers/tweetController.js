import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweetModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const userId = req.user._id;
  const { content } = req.body;
  const tweet = new Tweet({ userId, content });
  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet create successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.user._id;
  const tweets = await Tweet.find({ userId });
  if (!tweets) {
    throw new ApiError(400, "Tweets not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweet fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet ID is invalid");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { userId, content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params.id;
  const userId = req.user._id;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "tweet ID is invalid");
  }
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
