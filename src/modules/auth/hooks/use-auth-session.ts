"use client";

import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session-store";
import type { LoginFormValues } from "@/modules/auth/schemas/login-schema";
import type { RegisterFormValues } from "@/modules/auth/schemas/register-schema";
import { loginApi, registerApi } from "@/modules/auth/services/api-auth";
import type { ApiErrorShape, Role } from "@/modules/shared/types";

const roleHome: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  BARBER: "/barber/dashboard",
  CUSTOMER: "/customer/dashboard",
  GUEST: "/",
};

export function useAuthSession() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setUser = useSessionStore((state) => state.setUser);
  const clearSession = useSessionStore((state) => state.clearSession);

  async function login(values: LoginFormValues) {
    const session = await loginApi(values);
    setUser(session);
    router.push(roleHome[session.role]);
    router.refresh();
    return session;
  }

  async function register(values: RegisterFormValues) {
    const session = await registerApi(values);
    setUser(session);
    router.push(roleHome[session.role]);
    router.refresh();
    return session;
  }

  function logout() {
    clearSession();
    router.push("/login");
    router.refresh();
  }

  function getErrorMessage(err: unknown): string {
    const apiError = err as ApiErrorShape | undefined;
    if (apiError?.message) return apiError.message;
    if (err instanceof Error) return err.message;
    return "No fue posible completar la solicitud.";
  }

  return {
    user,
    hasHydrated,
    isAuthenticated: user.authenticated,
    roleHome,
    login,
    register,
    logout,
    getErrorMessage,
  };
}
