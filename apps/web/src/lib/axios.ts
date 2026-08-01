import axios from "axios";

const API_BASE_URL =
  typeof import.meta.env.VITE_API_BASE_URL === "string" &&
  import.meta.env.VITE_API_BASE_URL.length > 0
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3001";

export default axios.create({
  baseURL: API_BASE_URL
});
