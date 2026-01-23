import { Router } from "express";
import { uploadVideo } from "../controllers/videoController";

const router = Router();

router.route(
  "/upload-video".post(
    verifyJWT,
    uploadOnCloudinary.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ])
  ),
  uploadVideo
);

export default router