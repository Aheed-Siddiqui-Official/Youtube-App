// src/store/slices/commentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// ======================
// Async Thunks
// ======================

// Create a comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ videoId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/comment/create-comment", {
        content,
        videoId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment",
      );
    }
  },
);

// Get all comments for a video
export const getCommentsByVideo = createAsyncThunk(
  "comments/getCommentsByVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/comment/${videoId}`);
      // Ensure owner data is preserved from backend
      const comments = response.data.data;
      // console.log("Comments fetched from backend:", comments);
      return comments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments",
      );
    }
  },
);

// Update a comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/comment/comment-update/${commentId}`,
        {
          comment: content,
        },
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment",
      );
    }
  },
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/comment/comment-delete/${commentId}`);
      return commentId; // return id so we can remove it from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

// Like / Unlike comment
export const toggleLikeComment = createAsyncThunk(
  "comments/toggleLikeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/comment/like-comment/${commentId}`,
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to like/unlike comment",
      );
    }
  },
);

// ======================
// Slice
// ======================
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    commentsByVideo: {}, // { videoId: [comments] }
    loading: false,
    error: null,
    currentVideoId: null, // track which video's comments we're viewing
  },
  reducers: {
    clearCommentsError(state) {
      state.error = null;
    },
    setCurrentVideoId(state, action) {
      state.currentVideoId = action.payload;
    },
    // Optional: clear comments when leaving video page
    clearComments(state) {
      state.commentsByVideo = {};
      state.currentVideoId = null;
    },
  },
  extraReducers: (builder) => {
    // ── Create Comment ─────────────────────────────────────
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const videoId = action.payload.video;
        if (!state.commentsByVideo[videoId]) {
          state.commentsByVideo[videoId] = [];
        }
        // Ensure full owner object is preserved
        state.commentsByVideo[videoId].unshift({
          ...action.payload,
          owner: action.payload.owner || null, // explicitly include owner object
        });
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Get Comments ───────────────────────────────────────
    builder
      .addCase(getCommentsByVideo.pending, (state, action) => {
        state.loading = true;
        state.currentVideoId = action.meta.arg; // videoId
        state.error = null;
      })
      .addCase(getCommentsByVideo.fulfilled, (state, action) => {
        state.loading = false;
        // Store the entire comment object with owner data intact
        const videoId = state.currentVideoId;
        state.commentsByVideo[videoId] = action.payload.map((comment) => ({
          ...comment,
          owner: comment.owner || null, // ensure owner field exists
        }));
      })
      .addCase(getCommentsByVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Update Comment ─────────────────────────────────────
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const videoId = state.currentVideoId;
        if (state.commentsByVideo[videoId]) {
          const index = state.commentsByVideo[videoId].findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            // Preserve owner data when updating
            state.commentsByVideo[videoId][index] = {
              ...action.payload,
              owner:
                action.payload.owner ||
                state.commentsByVideo[videoId][index].owner,
            };
          }
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Delete Comment ─────────────────────────────────────
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        const videoId = state.currentVideoId;
        if (state.commentsByVideo[videoId]) {
          state.commentsByVideo[videoId] = state.commentsByVideo[
            videoId
          ].filter((c) => c._id !== action.payload);
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── Like / Unlike Comment ──────────────────────────────
    builder
      .addCase(toggleLikeComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikeComment.fulfilled, (state, action) => {
        state.loading = false;
        const videoId = state.currentVideoId;
        if (state.commentsByVideo[videoId]) {
          const index = state.commentsByVideo[videoId].findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            // Preserve owner data when updating likes
            state.commentsByVideo[videoId][index] = {
              ...action.payload,
              owner:
                action.payload.owner ||
                state.commentsByVideo[videoId][index].owner,
            };
          }
        }
      })
      .addCase(toggleLikeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentsError, setCurrentVideoId, clearComments } =
  commentSlice.actions;
export default commentSlice.reducer;
