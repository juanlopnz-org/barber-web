import axios from "axios";
import { useSessionStore } from "@/store/session-store";
import type { ApiErrorShape } from "@/modules/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useSessionStore.getState().user.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Auto-logout on 401 to avoid stale authenticated UI with dead tokens
    if (status === 401) {
      const current = useSessionStore.getState().user;
      if (current.authenticated) {
        useSessionStore.getState().clearSession();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
      }
    }

    const payload: ApiErrorShape = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        "No fue posible completar la solicitud.",
      code: error?.response?.data?.code,
      status,
      details: error?.response?.data,
    };

    return Promise.reject(payload);
  }
);
