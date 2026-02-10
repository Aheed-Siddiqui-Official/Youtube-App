import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//middlewares/configurations

//accepting json
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import videosRoutes from "./routes/video.routes.js";
import playlistRoutes from "./routes/playlist.routes.js"

//routes declare
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videosRoutes);
app.use("/api/v1/playlist", playlistRoutes)

export { app };
