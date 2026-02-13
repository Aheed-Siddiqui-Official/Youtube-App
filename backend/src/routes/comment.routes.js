import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
  getComment,
  likeComment,
  updateComment,
} from "../controllers/commentController.js";

const router = Router();

router.route("/create-comment").post(verifyJWT, createComment);
router.route("/:id").get(getComment);
router.route("/comment-delete/:id").delete(verifyJWT, deleteComment);
router.route("/comment-update/:id").patch(verifyJWT, updateComment);
router.route("/like-comment/:id").patch(verifyJWT, likeComment);

export default router;
