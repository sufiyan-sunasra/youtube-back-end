import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboardController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/stats", getChannelStats);
router.get("/videos", getChannelVideos);

export default router;
