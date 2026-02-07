import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";

export const increaseVisits = async (req, res, next) => {
  const slug = req.params.slug;
  const video = await Video.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const user = req?.user?._id;

  const his = await User.findOneAndUpdate(
    {
      _id: user,
    },
    {
      $push: { watchHistory: video._id },
    },
    {
      new: true,
    }
  );
};

export default increaseVisits;
