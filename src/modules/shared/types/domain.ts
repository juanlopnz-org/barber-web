import type { Role } from "./session";

export type AppointmentStatus =
  | "BOOKED"
  | "OFFERED"
  | "SWAP_PENDING"
  | "SWAP_MATCHED"
  | "TRANSFERRED"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export type SwapRequestStatus =
  | "OPEN"
  | "MATCHED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, "GUEST">;
  avatarUrl?: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  barberId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  customerId?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
}

export interface SwapRequest {
  id: string;
  appointmentId: string;
  status: SwapRequestStatus;
}
