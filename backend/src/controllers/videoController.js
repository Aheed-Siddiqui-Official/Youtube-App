import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category, isPublic } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError("All field are required");
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
  //   let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  //   let existSlug = await Video.findOne({ slug });
  //   let counter = 2;
  //   while (existSlug) {
  //     slug = `${slug}-${counter}`;
  //     existSlug = await Video.findOne({ slug });
  //     counter++;
  //   }

  //   console.log(slug);

  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let counter = 2;

  while (await Video.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

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
      .replace(/\.(mp4|mov|webm)$/i, ".jpg");
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

export const getAllVideos = asyncHandler(async (req, res) => {
  // Get page and limit from query params (default: page 1, limit 10)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Calculate skip value
  const skip = (page - 1) * limit;

  // Fetch videos with pagination
  const videos = await Video.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner");

  // Get total count for metadata
  const totalVideos = await Video.countDocuments({ isPublished: true });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export const getSingleVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({ slug: req?.params?.slug }).populate(
    "owner"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  let isSubscribed = false;

  if (req.user) {
    const subscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: video.owner._id,
    });

    isSubscribed = !!subscription;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req?.params?.id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req?.user?.id)) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(req?.params?.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// will see later
export const getVideosByUser = asyncHandler(async (req, res) => {
  // GET SELECTED USER VIDEOS
  const user = await User.findOne({ username: req?.params?.username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // GET SORT QUERY
  const { sort } = req.query; // Get sort query parameter (newest or oldest)
  let sortOption = { createdAt: -1 }; // Default newest

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  // GET VIDEOS WITH SORTING
  const videos = await Video.find({ owner: user._id })
    .sort(sortOption)
    .populate("owner");

  // RETURN RESPONSE
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export const updateVideo = asyncHandler(async (req, res) => {
  // GET SINGLE VIDEO
  // console.log(req.body)
  const video = await Video.findById(req?.params?.id);
  // CHECK VIDEO
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  // console.log(video)

  // CHECK FOR THE OWNER
  if (String(video.owner) !== String(req?.user?._id)) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  // GET VIDEO FROM MULTER
  const videoLocalPath = req.file?.path;

  // UPLOAD CLOUDINARY (only if video file is provided)
  let updatedVideoURL;
  if (videoLocalPath) {
    const uploadResponse = await uploadOnCloudinary(videoLocalPath);

    // DELETE OLD VIDEO if new video is uploaded
    await cloudinary.uploader.destroy(video.videoFile);

    // Update the video file URL with the response URL
    updatedVideoURL = uploadResponse?.secure_url; // Access the URL from the response
  }

  // Generate new thumbnail URL only if video is updated
  const newUpdatedVideoURL = updatedVideoURL || video.videoFile;

  // UPDATE VIDEO
  const updatedVideo = await Video.findByIdAndUpdate(
    req?.params?.id,
    {
      title: req.body.title || video?.title,
      description: req.body.description || video?.description,
      category: req.body.category || video?.category,
      slug: video?.slug,
      isPublic: req.body.isPublic || video?.isPublic,
      videoFile: newUpdatedVideoURL || video.videoFile, // Ensure videoFile is updated only if a new file is provided
    },
    { new: true }
  );
  // console.log(updateVideo)

  // RETURN RESPONSE
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

export const getMyVideos = asyncHandler(async (req, res) => {
  // req.user comes from auth middleware
  const userId = req.user._id;

  const { sort } = req.query;

  let sortOption = { createdAt: -1 }; // newest default

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const videos = await Video.find({ owner: userId })
    .sort(sortOption)
    .populate("owner", "username avatar"); // don't dump entire user doc

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Your videos fetched successfully"));
});
