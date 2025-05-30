import axios from "axios";

const baseURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
