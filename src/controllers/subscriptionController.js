import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channel ID");
  }

  let subscribed = await Subscription.findOne({
    channel: channelId,
    subscriber: userId,
  });

  if (subscribed) {
    await Subscription.deleteOne({ channel: channelId, subscriber: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, "channel subscribe removed"));
  } else {
    subscribed = await Subscription.create({
      channel: channelId,
      subscriber: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscribed, "channel subscribed successfully")
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "invalid channel ID");
  }

  const subscriptions = await Subscription.find({ channel: channelId })
    .populate({
      path: "subscriber",
      select: "fullName username avatar",
    })
    .exec();

  if (!subscriptions.length) {
    throw new ApiError(400, "No subscribers found for this channel");
  }

  const subscribers = subscriptions.map((sub) => sub.subscriber);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "invalid channel ID");
  }
  if (subscriberId !== userId) {
    throw new ApiError(403, "You are not authorized to access this channel");
  }
  const subscriptions = await Subscription.find({ subscriber: subscriberId })
    .populate({
      path: "channel",
      select: "fullName username avatar",
    })
    .exec();
  if (!subscriptions.length) {
    throw new ApiError(400, "You have not subscribed to any channels");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriptions,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
