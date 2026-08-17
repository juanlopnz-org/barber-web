import { api } from "@/modules/shared/lib/api-client";
import type { ApiErrorShape, SessionUser } from "@/modules/shared/types";

interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BARBER" | "CUSTOMER";
}

interface AuthResponseDto {
  token: string;
  refreshToken: string;
  user: AuthUserDto;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface RefreshPayload {
  refreshToken: string;
}

function mapAuthResponse(payload: AuthResponseDto): SessionUser {
  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    token: payload.token,
    refreshToken: payload.refreshToken,
    role: payload.user.role,
    authenticated: true,
  };
}

export async function loginApi(values: LoginPayload): Promise<SessionUser> {
  try {
    const { data } = await api.post<AuthResponseDto>("/auth/login", values);
    return mapAuthResponse(data);
  } catch (err) {
    throw err as ApiErrorShape;
  }
}

export async function registerApi(values: RegisterPayload): Promise<SessionUser> {
  try {
    const { data } = await api.post<AuthResponseDto>("/auth/register", values);
    return mapAuthResponse(data);
  } catch (err) {
    throw err as ApiErrorShape;
  }
}

export async function fetchMeApi(): Promise<SessionUser> {
  try {
    const { data } = await api.get<AuthUserDto>("/auth/me");
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      authenticated: true,
    };
  } catch (err) {
    throw err as ApiErrorShape;
  }
}

/**
 * Exchange a refresh_token for a new access_token + refresh_token pair.
 * Returns null if the refresh_token is invalid (caller should clear session).
 */
export async function refreshApi(
  refreshToken: string,
): Promise<SessionUser | null> {
  try {
    const { data } = await api.post<AuthResponseDto>("/auth/refresh", {
      refreshToken,
    } satisfies RefreshPayload);
    return mapAuthResponse(data);
  } catch {
    return null;
  }
}

/**
 * Invalidate the current session server-side. Best-effort: if the request
 * fails (e.g. token already expired), we still let the caller clear local
 * state.
 */
export async function logoutApi(): Promise<void> {
  try {
    await api.post<void>("/auth/logout");
  } catch {
    // intentionally swallow — caller clears local state regardless
  }
}
