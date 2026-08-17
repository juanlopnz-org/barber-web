"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import type { Role } from "@/modules/shared/types";

interface ProtectedRouteProps extends PropsWithChildren {
  allowedRoles: Role[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, hasHydrated } = useAuthSession();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user.authenticated) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace("/");
    }
  }, [allowedRoles, hasHydrated, router, user.authenticated, user.role]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-white/85 px-6 py-4 text-sm text-secondary shadow-soft">
          Cargando sesión...
        </div>
      </div>
    );
  }

  if (!user.authenticated || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
