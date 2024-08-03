import { Router } from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweetController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/", createTweet);
router.get("/user/:userId", getUserTweets);
router.patch("/:tweetId", updateTweet);
router.delete("/:tweetId", deleteTweet);

export default router;
