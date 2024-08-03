import { Router } from "express";
import {
  getSubscribedChannels,
  toggleSubscription,
  getUserChannelSubscribers,
} from "../controllers/subscriptionController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/channel/:channelId", getSubscribedChannels);
router.post("/channel/:channelId", toggleSubscription);
router.get("/user/:channelId", getUserChannelSubscribers);

export default router;
