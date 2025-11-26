import axios from "axios";
import Cookies from "js-cookie";
import { persistor } from "@/stores/store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Instance riêng chỉ dùng để refresh
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const access_token = Cookies.get("access_token");

  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
  
    if (!error.response) return Promise.reject(error);

    // Khi bị 401
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, chờ refresh xong rồi retry
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get("refresh_token");
      console.log("refreshToken", refreshToken);

      try {
        const res = await refreshApi.post("/auth/refresh-token", refreshToken, {
          headers: {
            "Content-Type": "application/json",
          },
          transformRequest: [(data) => data],
        });
        const newAccessToken = res.data.accessToken;

        Cookies.set("access_token", newAccessToken);
        processQueue(null, newAccessToken);

        // Retry lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
