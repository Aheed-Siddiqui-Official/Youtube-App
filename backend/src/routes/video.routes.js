import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getSingleVideo,
  getVideosByUser,
  updateVideo,
  uploadVideo,
} from "../controllers/videoController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { increaseVisits } from "../middlewares/increaseViews.middleware.js";

const router = Router();

router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

router.route("/").get(getAllVideos);

router.route("/:slug").get(verifyJWT, increaseVisits, getSingleVideo);

router.route("/:id").delete(verifyJWT, deleteVideo);

router.route("/user/:username").get(getVideosByUser);

router
  .route("/user/update/:id")
  .patch(verifyJWT, upload.single("video", updateVideo));

export default router;
