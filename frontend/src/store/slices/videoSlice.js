import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchMyVideos = createAsyncThunk(
  "video/fetchMyVideos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/videos/my-videos");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Fetch all videos with pagination
export const fetchAllVideos = createAsyncThunk(
  "video/fetchAllVideos",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/v1/videos?page=${page}&limit=${limit}`,
      );
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const uploadVideo = createAsyncThunk(
  "videos/uploadVideo",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/videos/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data; // uploaded video
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Delete a video
export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/v1/videos/${id}`);
      return id; // return deleted video id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Update a video
export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async (
    { videoId, title, description, isPublic, videoFile },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("isPublic", isPublic);
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const res = await api.patch(`/api/v1/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data; // return updated video
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const toggleSubscription = createAsyncThunk(
  "videos/toggleSubscription",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/v1/videos/subscription/${channelId}`);
      // backend returns { subscribed: true/false }
      return { channelId, subscribed: res.data.data.subscribed };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSubscriberCount = createAsyncThunk(
  "videos/fetchSubscriberCount",
  async (channelId, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/api/v1/videos/subscription/${channelId}/count`,
      );
      return { channelId, count: res.data.count };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchDashboardData = createAsyncThunk(
  "videos/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/videos/dashboard/data");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/v1/videos/like/${videoId}`);
      return {
        videoId,
        likesCount: res.data.data.likesCount,
        isLiked: res.data.data.isLiked,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle like",
      );
    }
  },
);

export const fetchLikedVideos = createAsyncThunk(
  "likes/fetchLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/videos/like`);
      return res.data.data.likedVideos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

export const fetchSingleVideo = createAsyncThunk(
  "videos/fetchSingleVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/videos/${videoId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    myVideos: [],
    allVideos: [],
    loading: false,
    loadingMore: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    subscribedChannels: [], // IDs of channels user subscribed to
    subscriberCounts: {},
    dashboard: null,
    dashboardLoading: false,
    likedVideos: [],
    status: "idle",
  },
  reducers: {
    resetAllVideos: (state) => {
      state.allVideos = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Videos
      .addCase(fetchMyVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.myVideos = action.payload;
      })
      .addCase(fetchMyVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Videos
      .addCase(fetchAllVideos.pending, (state) => {
        if (state.currentPage === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;

        if (state.currentPage === 1) {
          state.allVideos = action.payload;
        } else {
          state.allVideos = [...state.allVideos, ...action.payload];
        }

        // If we got fewer videos than requested, no more videos to load
        state.hasMore = action.payload.length === 10;
        state.currentPage += 1;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })
      // Upload
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.myVideos.unshift(action.payload); // prepend new video
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.myVideos = state.myVideos.filter((v) => v._id !== action.payload);
      })
      // Update
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        // Update the video in myVideos array
        const index = state.myVideos.findIndex(
          (v) => v._id === action.payload._id,
        );
        if (index !== -1) {
          state.myVideos[index] = action.payload;
        }
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { subscribed, channelId } = action.payload;

        if (!state.subscriberCounts[channelId]) {
          state.subscriberCounts[channelId] = 0;
        }

        //Redux keeps track of which channels the logged-in user is subscribed to. This allows dynamic button updates on any page.
        if (subscribed) {
          if (!state.subscribedChannels.includes(channelId)) {
            state.subscribedChannels.push(channelId);
          }
          state.subscriberCounts[channelId] += 1;
        } else {
          // remove channel
          state.subscribedChannels = state.subscribedChannels.filter(
            (id) => id !== channelId,
          );
          state.subscriberCounts[channelId] = Math.max(
            state.subscriberCounts[channelId] - 1,
            0,
          );
        }
      })
      .addCase(fetchSubscriberCount.fulfilled, (state, action) => {
        const { channelId, count } = action.payload;
        if (!state.subscriberCounts) state.subscriberCounts = {};
        state.subscriberCounts[channelId] = count;
      })
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state) => {
        state.dashboardLoading = false;
      })
      .addCase(fetchLikedVideos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.likedVideos = action.payload;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { videoId, likesCount, isLiked } = action.payload;
        if (state.currentVideo?._id === videoId) {
          state.currentVideo.likesCount = likesCount;
          // state.currentVideo.isLiked = isLiked; // if you store it
        }

        // Optional: update in lists too (Home grid, Liked page, etc.)
        const updateList = (listName) => {
          const videos = state[listName];
          if (!videos) return;
          const idx = videos.findIndex((v) => v._id === videoId);
          if (idx !== -1) {
            videos[idx] = { ...videos[idx], likesCount };
          }
        };

        updateList("allVideos");
        updateList("myVideos");
        updateList("likedVideos");
      })
      .addCase(fetchSingleVideo.fulfilled, (state, action) => {
        // Optional: you can store it in a separate field
        state.currentVideo = action.payload;
      });
  },
});

export const { resetAllVideos } = videoSlice.actions;
export default videoSlice.reducer;
