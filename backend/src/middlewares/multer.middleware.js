import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // 1GB file size limit
  },
});
