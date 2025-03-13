import axios from "axios";

// const baseURL = "https://outgoing-endlessly-locust.ngrok-free.app/api";

const baseURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "ngrok-skip-browser-warning": "69420",
  },
});

export default api;
