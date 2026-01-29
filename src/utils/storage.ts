export const resolveStorageUrl = (path: string | null | undefined) => {
  if (!path) return "";

  // If it's already a full URL, return it
  if (
    path.startsWith("http") ||
    path.startsWith("https") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const runtimeConfig = (window as any)?.APP_CONFIG;
  const storageBase =
    runtimeConfig?.STORAGE_URL || import.meta.env.VITE_STORAGE_URL || "";
  const apiBase =
    runtimeConfig?.API_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // If path starts with /storage/, replace it with the storage base
  if (path.startsWith("/storage/")) {
    if (storageBase) {
      return `${storageBase.replace(/\/$/, "")}${path}`;
    }
    return `${apiBase.replace(/\/$/, "")}${path}`;
  }

  // Fallback for legacy /uploads/
  if (path.startsWith("/uploads/")) {
    return `${apiBase}${path}`;
  }

  return path;
};
