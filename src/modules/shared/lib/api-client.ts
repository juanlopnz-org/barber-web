import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useSessionStore } from "@/store/session-store";
import type { ApiErrorShape } from "@/modules/shared/types";
import {
  getFriendlyErrorMessage,
  getLoadingMessage,
  getSuccessMessage,
  showErrorToast,
  showSuccessToast,
  startRequestActivity,
  stopRequestActivity,
  type HttpMethod,
} from "@/modules/shared/lib/request-feedback";

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
let requestSequence = 0;

type FeedbackRequestConfig = InternalAxiosRequestConfig & {
  _feedbackId?: string;
  _feedbackCompleted?: boolean;
  feedback?: boolean;
};

function methodFrom(config?: AxiosRequestConfig): HttpMethod {
  const method = config?.method?.toLowerCase();
  return method === "post" || method === "put" || method === "patch" || method === "delete"
    ? method
    : "get";
}

function shouldShowSuccess(config: FeedbackRequestConfig) {
  return config.feedback !== false && methodFrom(config) !== "get";
}

function errorToastKey(config: AxiosRequestConfig, status?: number) {
  return `${methodFrom(config)}:${config.url ?? "unknown"}:${status ?? "network"}`;
}
let pendingQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

function flushPendingQueue(error: unknown, newToken?: string) {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data as
        | { message?: string | string[]; code?: string }
        | undefined;
      const message = getFriendlyErrorMessage(status, responseData?.message);
      const feedbackConfig = config as FeedbackRequestConfig;

      if (!feedbackConfig._feedbackCompleted) {
        feedbackConfig._feedbackCompleted = true;
        stopRequestActivity(feedbackConfig._feedbackId);
        if (feedbackConfig.feedback !== false && feedbackConfig._feedbackId) {
          showErrorToast(message, errorToastKey(feedbackConfig, status));
        }
      }

      reject({
        message,
        code: responseData?.code,
        status,
        details: axiosError.response?.data,
      } satisfies ApiErrorShape);
    } else if (newToken && config.headers) {
      config.headers.Authorization = `Bearer ${newToken}`;
      void api.request(config).then(resolve).catch(reject);
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

  const feedbackConfig = config as FeedbackRequestConfig;
  if (feedbackConfig.feedback !== false && !feedbackConfig._feedbackId) {
    requestSequence += 1;
    feedbackConfig._feedbackId = `request-${requestSequence}`;
    startRequestActivity(
      feedbackConfig._feedbackId,
      getLoadingMessage(methodFrom(feedbackConfig), feedbackConfig.url),
    );
  }
  return config;
});

// ---------------------------------------------------------------------------
//  Response interceptor — shape errors, attempt refresh on 401
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    const config = response.config as FeedbackRequestConfig;
    if (!config._feedbackCompleted) {
      config._feedbackCompleted = true;
      stopRequestActivity(config._feedbackId);
      if (shouldShowSuccess(config) && config._feedbackId) {
        showSuccessToast(
          getSuccessMessage(methodFrom(config), config.url),
          config._feedbackId,
        );
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const originalConfig = error.config as (FeedbackRequestConfig & {
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

    const responseData = error?.response?.data as
      | { message?: string | string[]; code?: string }
      | undefined;
    const friendlyMessage = getFriendlyErrorMessage(status, responseData?.message);

    if (originalConfig && !originalConfig._feedbackCompleted) {
      originalConfig._feedbackCompleted = true;
      stopRequestActivity(originalConfig._feedbackId);
      if (originalConfig.feedback !== false && originalConfig._feedbackId) {
        showErrorToast(friendlyMessage, errorToastKey(originalConfig, status));
      }
    }

    const payload: ApiErrorShape = {
      message: friendlyMessage,
      code: responseData?.code,
      status,
      details: error?.response?.data,
    };

    return Promise.reject(payload);
  },
);
