import { Router } from "express";
import {
  dashBoardData,
  deleteVideo,
  getAllVideos,
  getLikedVideos,
  getMyVideos,
  getSingleVideo,
  getSubscribers,
  getVideosByUser,
  toggleLike,
  toggleSubscription,
  updateVideo,
  uploadVideo,
} from "../controllers/videoController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { increaseVisits } from "../middlewares/increaseViews.middleware.js";

const router = Router();

/////////////////////////
// STATIC ROUTES
/////////////////////////

router.post(
  "/upload-video",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

router.get("/", getAllVideos);

router.get("/my-videos", verifyJWT, getMyVideos);

router.get("/like", verifyJWT, getLikedVideos);
router.post("/like/:videoId", verifyJWT, toggleLike);

router.get("/dashboard/data", verifyJWT, dashBoardData);

router.post("/subscription/:channelId", verifyJWT, toggleSubscription);
router.get("/subscription/:channelId/count", getSubscribers);

router.get("/user/:username", getVideosByUser);

router.patch(
  "/user/update/:id",
  verifyJWT,
  upload.single("video"),
  updateVideo
);

/////////////////////////
// DYNAMIC ROUTES
/////////////////////////

router.get("/:videoId", verifyJWT, increaseVisits, getSingleVideo);

router.delete("/:id", verifyJWT, deleteVideo);

export default router;
