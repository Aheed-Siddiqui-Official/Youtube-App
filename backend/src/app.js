import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

const app = express();

void connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CORS_ORIGIN,
]
  .filter(Boolean)
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

//middlewares/configurations

//accepting json - LARGE LIMITS FOR FILE UPLOADS
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import videosRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js"
import commentRoutes from "./routes/comment.routes.js"

//routes declare
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videosRoutes);
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/comment", commentRoutes)

export { app };
export default app;
