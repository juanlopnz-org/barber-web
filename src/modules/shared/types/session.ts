export type Role = "ADMIN" | "BARBER" | "CUSTOMER" | "GUEST";

export type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
  refreshToken?: string;
  role: Role;
  authenticated: boolean;
  /** UUID of the linked Barber record (when role === BARBER). */
  barberId?: string | null;
  /** UUID of the linked Customer record (when role === CUSTOMER). */
  customerId?: string | null;
};

export const guestSession: SessionUser = {
  role: "GUEST",
  authenticated: false,
};
