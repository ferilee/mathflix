export type StaffRole = "admin" | "guru";

export interface StaffUser {
  role: StaffRole;
  username?: string;
  nip?: string;
  full_name?: string;
  school?: string;
}

const STAFF_USER_KEY = "staff_user";
const AUTH_TOKEN_KEY = "auth_token";

export const getAuthStrategy = (): string => {
  const runtimeConfig = (window as any)?.APP_CONFIG;
  return (
    runtimeConfig?.AUTH_STRATEGY ||
    import.meta.env.VITE_AUTH_STRATEGY ||
    "cookie"
  );
};

export const getStaffUser = (): StaffUser | null => {
  const raw =
    localStorage.getItem(STAFF_USER_KEY) || localStorage.getItem("admin_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StaffUser;
  } catch {
    return null;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token?: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const setStaffUser = (user: StaffUser, token?: string | null) => {
  localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
  if (user.role === "admin") {
    localStorage.setItem(
      "admin_user",
      JSON.stringify({ username: user.username, role: "admin" }),
    );
  }
  if (token) {
    setAuthToken(token);
  }
};

export const clearStaffUser = () => {
  localStorage.removeItem(STAFF_USER_KEY);
  localStorage.removeItem("admin_user");
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getStaffDisplayName = (user?: StaffUser | null) => {
  if (!user) return "";
  return user.full_name || user.username || user.nip || "Pengguna";
};

export const getStaffActorId = (user?: StaffUser | null) => {
  if (!user) return "system";
  if (user.role === "admin") return user.username || "admin";
  return user.nip || user.full_name || "guru";
};
