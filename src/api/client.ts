import axios from "axios";
import { llmConfig } from "@/config/llmConfig";

export const apiClient = axios.create({
  baseURL: llmConfig.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);
