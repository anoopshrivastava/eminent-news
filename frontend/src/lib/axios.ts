
import axios from "axios";

const baseURL = `${import.meta.env.VITE_BASE_URL}/api/v1` || "";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
