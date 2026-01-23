import { Video } from "../models/video.model";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category, isPublic } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new Error("All field are required");
  }

  const videoLocalPath = req.files?.video?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const videoURL = await uploadOnCloudinary(videoLocalPath);

  if (!videoURL) {
    throw new ApiError(400, "Failed to upload video");
  }

  // SLUG LOGIC
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  let existSlug = await Video.findOne({ slug });
  let counter = 2;
  while (existSlug) {
    slug = `${slug}-${counter}`;
    existSlug = await Video.findOne({ slug });
    counter++;
  }

  console.log(slug);

  let thumbnailUrl;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (thumbnailLocalPath) {
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedThumbnail) {
      throw new ApiError(400, "Failed to upload thumbnail");
    }

    thumbnailUrl = uploadedThumbnail.url;
  } else {
    // Agar user ne thumbnail nahi diya toh Cloudinary ka auto-generated thumbnail lo

    thumbnailUrl = videoURL?.url
      .replace("/upload/", "/upload/so_1,w_600,c_fill/")
      .replace(".mp4", ".jpg");
  }

  const video = await Video.create({
    title,
    description,
    category,
    slug,
    isPublic,
    thumbnail: thumbnailUrl,
    videoFile: videoURL?.url,
    owner: req?.user?._id,
    duration: videoURL?.duration,
  });

  if (!video) {
    throw new ApiError(500, "Failed to create video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully")); 
});

