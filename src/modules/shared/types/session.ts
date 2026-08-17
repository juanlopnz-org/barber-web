export type Role = "ADMIN" | "BARBER" | "CUSTOMER" | "GUEST";

export type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
  refreshToken?: string;
  role: Role;
  authenticated: boolean;
};

export const guestSession: SessionUser = {
  role: "GUEST",
  authenticated: false,
};
