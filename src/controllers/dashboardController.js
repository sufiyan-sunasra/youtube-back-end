import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const { channelId } = req.params;

  // Validate the channel ID
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  // Count the total number of videos owned by the channel
  const totalVideos = await Video.countDocuments({ owner: channelId });

  // Aggregate the total views of all videos owned by the channel
  const totalViewsAggregate = await Video.aggregate([
    { $match: { owner: mongoose.Types.ObjectId(channelId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews =
    totalViewsAggregate.length > 0 ? totalViewsAggregate[0].totalViews : 0;

  // Count the total number of subscribers to the channel
  const totalSubscribers = await Subscription.countDocuments({
    channel: channelId,
  });

  // Count the total number of likes across all videos in the channel
  const totalLikes = await Like.countDocuments({ channel: channelId });

  // Prepare the response object
  const response = {
    totalVideos,
    totalViews,
    totalSubscribers,
    totalLikes,
  };

  // Send the response
  res.status(200).json(new ApiResponse(response));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;

  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId });

  res.status(200).json(new ApiResponse(videos));
});

export { getChannelStats, getChannelVideos };
