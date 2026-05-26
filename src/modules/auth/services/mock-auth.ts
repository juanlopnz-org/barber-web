import type { LoginFormValues } from "@/modules/auth/schemas/login-schema";
import type { RegisterFormValues } from "@/modules/auth/schemas/register-schema";
import type { Role, SessionUser } from "@/modules/shared/types";

function resolveRole(email: string): Role {
  if (email.includes("admin")) return "ADMIN";
  if (email.includes("barber")) return "BARBER";
  return "CUSTOMER";
}

export async function loginWithEmail(values: LoginFormValues): Promise<SessionUser> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const role = resolveRole(values.email.toLowerCase());

  return {
    id: crypto.randomUUID(),
    name:
      role === "ADMIN"
        ? "Admin Demo"
        : role === "BARBER"
          ? "Barber Demo"
          : "Juan Carlos",
    email: values.email,
    role,
    authenticated: true,
  };
}

export async function registerCustomer(
  values: RegisterFormValues
): Promise<SessionUser> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    id: crypto.randomUUID(),
    name: values.name,
    email: values.email,
    role: "CUSTOMER",
    authenticated: true,
  };
}
