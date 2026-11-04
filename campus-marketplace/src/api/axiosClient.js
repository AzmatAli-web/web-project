import axios from "axios";
import { API_URL } from "./config";
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { Accept: "application/json" },
});
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  // Let the browser generate the multipart boundary for uploads.
  if (config.data instanceof FormData) config.headers.setContentType(undefined);
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (
      typeof response.data === "string" &&
      /<(!doctype|html)/i.test(response.data)
    ) {
      return Promise.reject(
        new Error(
          "The API returned a web page instead of data. Check the backend URL and deployment routes.",
        ),
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
    }
    if (!error.response)
      error.message =
        error.code === "ECONNABORTED"
          ? "The server took too long to respond. Please try again."
          : "Cannot reach the marketplace server. Please try again shortly.";
    else if (typeof error.response.data?.message === "string")
      error.message = error.response.data.message;
    else if (error.response.status >= 500)
      error.message =
        "The marketplace service is unavailable. Please try again shortly.";
    return Promise.reject(error);
  },
);
export default axiosClient;
