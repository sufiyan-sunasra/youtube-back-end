import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlistController.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist);

router.get("/:playlistId", getPlaylistById);
router.patch("/:playlistId", updatePlaylist);
router.delete("/:playlistId", deletePlaylist);

router.patch("/add/:videoId/:playlistId", addVideoToPlaylist);
router.patch("/remove/:videoId/:playlistId", removeVideoFromPlaylist);

router.get("/user/:userId", getUserPlaylists);

export default router;
