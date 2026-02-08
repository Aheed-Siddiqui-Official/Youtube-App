import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";

export const increaseVisits = async (req, res, next) => {
  try {
    const videoId = req.params.videoId; // match your route
    const video = await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 },
    });

    if (!video) {
      throw new ApiError(400, "Video not found");
    }

    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { watchHistory: video._id },
      });
    }

    next(); // move to getSingleVideo
  } catch (err) {
    next(err);
  }
};
