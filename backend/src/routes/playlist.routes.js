import { Router } from "express";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getSinglePlaylist,
  togglePlaylist,
} from "../controllers/playlistController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// CREATE NEW PLAYLIST
router.route("/create-new-playlist").post(verifyJWT, createPlaylist);

// GET ALL PLAYLISTS
router.route("/").get(verifyJWT, getPlaylist);

// DELETE PLAYLISTS
router.route("/:id").delete(verifyJWT, deletePlaylist);

// TOGGLE PLAYLIST
router.route("/toggle-playlist/:id").patch(verifyJWT, togglePlaylist);

// GET SINGLE PLAYLIST
router.route("/playlist/:id").get(verifyJWT, getSinglePlaylist);

export default router
