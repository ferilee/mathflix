import axios from "axios";
import { clearStaffUser, getAuthStrategy, getAuthToken } from "../utils/auth";

// Check for runtime configuration first, fallback to build-time env
const runtimeConfig = (window as any).APP_CONFIG;
const baseURL =
  runtimeConfig?.API_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.withCredentials = getAuthStrategy() === "cookie";
  const token = getAuthToken();
  if (token) {
    const normalized = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    config.headers = {
      ...config.headers,
      Authorization: normalized,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      clearStaffUser();
      localStorage.removeItem("student");
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
