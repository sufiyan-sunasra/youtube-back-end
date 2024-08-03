import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  registerUser,
  renewAccessToken,
  updateUser,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/userController.js";
import { upload } from "../middelwares/multerMiddelware.js";
import { verifyJWT } from "../middelwares/authMiddelware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", verifyJWT, logoutUser);

router.post("/refresh-token", renewAccessToken);

router.post("/change-password", verifyJWT, changeCurrentPassword);

router.get("/current-user", verifyJWT, getCurrentUser);

router.patch("/update-account", verifyJWT, updateUser);

router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);

router.patch(
  "/cover-image",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);

router.get("/channel/:username", verifyJWT, getUserChannelProfile);

router.get("/watch-history", verifyJWT, getWatchHistory);
export default router;
