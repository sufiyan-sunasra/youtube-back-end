import { Router } from "express";
import {
  getVideoComments,
  addComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/:videoId", getVideoComments);
router.post("/:videoId", addComment);
router.patch("/comment/:commentId", updateComment);
router.delete("/comment/:commentId", deleteComment);

export default router;
