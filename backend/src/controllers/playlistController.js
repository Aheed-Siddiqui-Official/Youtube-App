import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Playlist description is required");
  }

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized - user not found");
  }

  const newPlaylist = await Playlist.create({
    name:name.trim(),
    description:description.trim(),
    videos: [],
    owner:req.user._id
  });

  if (!newPlaylist) {
    throw new ApiError(500, "Failed to create playlist");
  }

  // RETURN NEW PLAYLIST RESPONSE

  return res
    .status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

export const getPlaylist = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ user: req?.user?._id }).populate(
    "videos"
  );

  if (!playlists) {
    throw new ApiError(404, "No Playlist Exist ");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req?.params?.id);
  // console.log(playlist)
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export const togglePlaylist = asyncHandler(async (req, res) => {
  // playlist req.body
  // authenticate
  // check video : remove ? add

  const { slug } = req.body;
  const playlist = await Playlist.findById(req?.params?.id);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findOne({ slug });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  (await Video.findByIdAndUpdate(video?._id),
    {
      $set: { isChecked: !video.isChecked },
    },
    { new: true });

  const isCheckedPlaylist = playlist?.videos?.includes(video?._id);

  const updateQuery = isCheckedPlaylist
    ? {
        $pull: { videos: video?._id },
        $unset: { slug: "" }, // Remove slug when removing video
      }
    : {
        $push: { videos: video?._id },
        $set: { slug }, // Store latest added video's slug
      };

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    req?.params?.id,
    updateQuery,
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        isCheckedPlaylist
          ? "Video removed from playlist"
          : "Video added to playlist"
      )
    );
});

export const getSinglePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req?.params?.id).populate({
    path: "videos",
    select: "title thumbnail owner views createdAt",
    options: { sort: { createdAt: -1 } }, // Sort videos by createdAt
    populate: {
      path: "owner",
      select: "username avatar",
    },
  });
  // console.log(playlist);
  

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});
