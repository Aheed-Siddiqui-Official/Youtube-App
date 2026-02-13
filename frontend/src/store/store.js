import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import videoSlice from "./slices/videoSlice";
import playlistReducer from "./slices/playlistSlice"
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    videos: videoSlice,
    playlist: playlistReducer,
    comments:commentReducer
  },
});
