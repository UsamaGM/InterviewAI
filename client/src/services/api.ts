import axios from "axios";

const baseURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api;
