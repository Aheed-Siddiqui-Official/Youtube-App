import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
};

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;

    if (file.buffer) {
      return await uploadBufferToCloudinary(file.buffer);
    }

    return await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary };
