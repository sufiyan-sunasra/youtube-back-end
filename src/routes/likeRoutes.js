import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/likeController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/toggle/video/:videoId", toggleVideoLike);
router.post("/toggle/comment/:commentId", toggleCommentLike);
router.post("/toggle/tweet/:tweetId", toggleTweetLike);
router.get("/videos", getLikedVideos);

export default router;
