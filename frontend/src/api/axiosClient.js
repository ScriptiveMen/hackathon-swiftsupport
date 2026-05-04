import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true,
});


// Attach JWT from localStorage to every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Handle 401 globally — clear token and redirect to login
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/" && currentPath !== "/admin-register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);


export default axiosClient;
