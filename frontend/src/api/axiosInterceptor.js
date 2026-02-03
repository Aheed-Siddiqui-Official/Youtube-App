import api from "./api";
import { logoutUser } from "../store/slices/authSlice";

let isRefreshing = false; // flag to know if refresh request is in progress
let failedQueue = []; // queue of requests that come in while refreshing

// Process the queued requests after refresh finishes
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = (store) => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      const skipUrls = [
        "/users/login",
        "/users/register",
        "/users/refresh-token",
        "/users/logout",
      ];

      if (skipUrls.some((url) => originalRequest.url.includes(url))) {
        return Promise.reject(error);
      }

      if (
        !error.response ||
        error.response.status !== 401 ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      if (originalRequest.url.includes("/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await api.post("/api/v1/users/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        store.dispatch(logoutUser());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    },
  );
};
