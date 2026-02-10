import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import videoSlice from "./slices/videoSlice";
import playlistReducer from "./slices/playlistSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    videos: videoSlice,
    playlist: playlistReducer,
  },
});
