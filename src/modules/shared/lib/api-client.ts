import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useSessionStore } from "@/store/session-store";
import type { ApiErrorShape } from "@/modules/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
//  Refresh-on-401
// ---------------------------------------------------------------------------
// When a request fails with 401, try to exchange the stored refresh_token
// for a new access_token. If that succeeds, retry the original request once.
// If the refresh fails, clear the session and broadcast the logout event so
// the UI can react.
// ---------------------------------------------------------------------------

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

function flushPendingQueue(error: unknown, newToken?: string) {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else if (newToken && config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`;
      resolve(api.request(config));
    } else {
      reject(new Error("Unauthorized"));
    }
  });
  pendingQueue = [];
}

/**
 * Exchange the stored refresh_token for a new pair.
 * Returns the new access token or null if refresh failed.
 */
async function refreshAccessToken(): Promise<string | null> {
  const state = useSessionStore.getState();
  const refreshToken = state.user.refreshToken;
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<{
      token: string;
      refreshToken: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: "ADMIN" | "BARBER" | "CUSTOMER";
      };
    }>(`${API_URL}/auth/refresh`, { refreshToken });
    state.setUser({
      ...state.user,
      token: data.token,
      refreshToken: data.refreshToken,
    });
    return data.token;
  } catch {
    state.clearSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
//  Request interceptor — attach bearer token
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = useSessionStore.getState().user.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------------------------------------------------------
//  Response interceptor — shape errors, attempt refresh on 401
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const originalConfig = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
    }) | undefined;

    const isAuthEndpoint =
      originalConfig?.url?.includes("/auth/login") ||
      originalConfig?.url?.includes("/auth/register") ||
      originalConfig?.url?.includes("/auth/refresh");

    // Try to refresh once on 401 for non-auth endpoints
    if (
      status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !isAuthEndpoint
    ) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          pendingQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken && originalConfig.headers) {
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        const response = await api.request(originalConfig);
        flushPendingQueue(undefined, newToken);
        return response;
      }

      flushPendingQueue(error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    } else if (status === 401 && !isAuthEndpoint) {
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
      code: (error?.response?.data as { code?: string } | undefined)?.code,
      status,
      details: error?.response?.data,
    };

    return Promise.reject(payload);
  },
);
