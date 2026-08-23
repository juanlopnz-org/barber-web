import { api } from "@/modules/shared/lib/api-client";
import type { ApiErrorShape, SessionUser } from "@/modules/shared/types";

interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "BARBER" | "CUSTOMER";
  barberId?: string | null;
  customerId?: string | null;
}

interface AuthResponseDto {
  token: string;
  refreshToken: string;
  user: AuthUserDto;
}

interface LoginPayload {
  phone: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
  email?: string;
}

interface RefreshPayload {
  refreshToken: string;
}

/**
 * Response shape from POST /api/auth/check-phone. The UI uses this to show
 * "we already have N bookings on file for this number" before the user
 * completes the registration form, so they know their future account will
 * inherit those appointments.
 */
export interface CheckPhoneResponse {
  exists: boolean;
  customerName: string | null;
  linkedAppointments: number | null;
}

function mapAuthResponse(payload: AuthResponseDto): SessionUser {
  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    phone: payload.user.phone,
    token: payload.token,
    refreshToken: payload.refreshToken,
    role: payload.user.role,
    authenticated: true,
    barberId: payload.user.barberId ?? null,
    customerId: payload.user.customerId ?? null,
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

export async function checkPhoneApi(phone: string): Promise<CheckPhoneResponse> {
  try {
    const { data } = await api.post<CheckPhoneResponse>("/auth/check-phone", {
      phone,
    });
    return data;
  } catch (err) {
    throw err as ApiErrorShape;
  }
}

export async function fetchMeApi(): Promise<SessionUser> {
  try {
    const { data } = await api.get<AuthUserDto>("/auth/me");
    return {
      id: data.id,
      barberId: data.barberId ?? null,
      customerId: data.customerId ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      authenticated: true,
    };
  } catch (err) {
    throw err as ApiErrorShape;
  }
}

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

export async function logoutApi(): Promise<void> {
  try {
    await api.post<void>("/auth/logout");
  } catch {
    // intentionally swallow — caller clears local state regardless
  }
}

export async function adminResetCustomerPasswordApi(
  phone: string,
  newPassword: string,
): Promise<void> {
  await api.post("/auth/admin/customers/reset-password", { phone, newPassword });
}
