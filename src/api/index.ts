import axios from "axios";

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

export default api;
