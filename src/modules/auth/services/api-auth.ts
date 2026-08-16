import { api } from "@/modules/shared/lib/api-client";
import type { ApiErrorShape, SessionUser } from "@/modules/shared/types";

interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "BARBER" | "CUSTOMER";
  };
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

function mapAuthResponse(payload: AuthResponseDto): SessionUser {
  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    token: payload.token,
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
    const { data } = await api.get<AuthResponseDto["user"]>("/auth/me");
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
