import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async ({name, description}, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/v1/playlist/create-new-playlist", {
        name,
        description
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create playlist",
      );
    }
  },
);

export const fetchPlaylists = createAsyncThunk(
  "playlist/fetchPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/playlist");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch playlists",
      );
    }
  },
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/playlist/${id}`);
      return id; // return ID to remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete playlist",
      );
    }
  },
);

export const toggleVideoInPlaylist = createAsyncThunk(
  "playlist/toggleVideoInPlaylist",
  async ({ playlistId, slug }, { rejectWithValue }) => {
    try {
      const res = await api.patch(
        `/api/v1/playlist/toggle-playlist/${playlistId}`,
        { slug },
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle video",
      );
    }
  },
);

export const fetchSinglePlaylist = createAsyncThunk(
  "playlist/fetchSinglePlaylist",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/v1/playlist/playlist/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch playlist",
      );
    }
  },
);

const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlists: [], // all user's playlists
    singlePlaylist: null, // current viewed playlist
    loading: false,
    error: null,
  },
  reducers: {
    clearSinglePlaylist: (state) => {
      state.singlePlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch All
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      state.playlists = state.playlists.filter((p) => p._id !== action.payload);
    });

    // Toggle Video
    builder.addCase(toggleVideoInPlaylist.fulfilled, (state, action) => {
      if (state.singlePlaylist?._id === action.payload._id) {
        state.singlePlaylist = action.payload;
      }
      // Optional: update in playlists list too
      const idx = state.playlists.findIndex(
        (p) => p._id === action.payload._id,
      );
      if (idx !== -1) state.playlists[idx] = action.payload;
    });

    // Fetch Single
    builder
      .addCase(fetchSinglePlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSinglePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePlaylist = action.payload;
      })
      .addCase(fetchSinglePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSinglePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
