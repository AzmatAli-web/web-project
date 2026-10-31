import client from "../api/axiosClient";
function saveSession(data) {
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("auth-change"));
  }
  return data;
}
export const authService = {
  register: async (data) =>
    saveSession((await client.post("/auth/register", data)).data),
  login: async (data) =>
    saveSession((await client.post("/auth/login", data)).data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete client.defaults.headers.common.Authorization;
    window.dispatchEvent(new Event("auth-change"));
  },
  getCurrentUser: () => {
    try {
      return localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  getToken: () => localStorage.getItem("token"),
};
export default authService;
