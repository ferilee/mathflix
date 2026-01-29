// Runtime configuration file
window.APP_CONFIG = {
  API_URL: "{{API_URL}}" || "http://localhost:3000",
  // AUTH_STRATEGY: "cookie" | "token"
  AUTH_STRATEGY: "{{AUTH_STRATEGY}}" || "cookie",
  // STORAGE_URL: "http://localhost:3000" (optional, default uses API_URL + /storage)
  STORAGE_URL: "{{STORAGE_URL}}" || "",
};
