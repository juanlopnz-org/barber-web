import axios from "axios";
import type { ApiErrorShape } from "@/modules/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload: ApiErrorShape = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        "No fue posible completar la solicitud.",
      code: error?.response?.data?.code,
      status: error?.response?.status,
      details: error?.response?.data,
    };

    return Promise.reject(payload);
  }
);
