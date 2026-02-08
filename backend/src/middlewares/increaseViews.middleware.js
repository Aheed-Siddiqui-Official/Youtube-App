import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";

export const increaseVisits = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    const alreadyWatched = await User.findOne({
      _id: req.user._id,
      watchHistory: videoId,
    });

    if (!alreadyWatched) {
      video.views += 1;
      await video.save();

      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: videoId },
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};
