import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// --------------------
//  Async thunk
// --------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/users/register`, formData);
      return response.data.data; // created user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/users/login`, {
        email,
        password,
      });
      return response.data.data.user; // backend returns user here
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { fulfillWithValue }) => {
    try {
      await api.post(`/api/v1/users/logout`);
    } catch (e) {
      // ignore errors — user is logging out anyway
    }

    return fulfillWithValue(true);
  },
);

// Fetch current user on app boot
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/users/current-user`);
      return response.data.data; // backend sends user in data.data
    } catch (error) {
      // Only reject on 401 (unauthorized), network errors keep user intact
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized");
      }
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  },
);

// Update details
export const updateAccount = createAsyncThunk(
  "auth/update-account",
  async ({ fullName, email, username }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/api/v1/users/update-account", {
        username,
        fullName,
        email,
      });
      return response.data.data; // return updated user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

// Update password
export const changePassword = createAsyncThunk(
  "auth/change-password",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/users/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data.message; // just a success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password update failed",
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "auth/update-avatar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.patch("/api/v1/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data; // return updated user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Avatar update failed",
      );
    }
  },
);

export const updateCoverImage = createAsyncThunk(
  "auth/update-cover",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const response = await api.patch("/api/v1/users/cover-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data; // return updated user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Cover Image update failed",
      );
    }
  },
);

export const fetchWatchHistory = createAsyncThunk(
  "videos/fetchWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/users/history");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch watch history",
      );
    }
  },
);

// --------------------
// Slice
// --------------------
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // logged in user
    isAuthenticated: false,
    isLoading: false,
    error: null,
    authChecked: false,
    watchHistory: [],
    watchHistoryStatus: "idle",
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setUser(state, action) {
      // Used by profile update
      state.user = action.payload;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- Register --------
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Account created successfully! Please log in."; // This triggers redirect in Signup.jsx
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      })

      // -------- Login --------
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // -------- Logout --------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })

      // -------- Fetch Current User (Initial Auth Check) --------
      .addCase(fetchCurrentUser.pending, (state) => {
        // Don't set isLoading for initial auth check
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.user = action.payload; // updated user info
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user.avatar = action.payload.avatar;
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.user.coverImage = action.payload.coverImage;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.error = null; // clear error
      })
      .addCase(fetchWatchHistory.pending, (state) => {
        state.watchHistoryStatus = "loading";
      })
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.watchHistoryStatus = "succeeded";
        state.watchHistory = action.payload;
      })
      .addCase(fetchWatchHistory.rejected, (state, action) => {
        state.watchHistoryStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice;
