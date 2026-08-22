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
  barbershopId: string;
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

/**
 * Response from GET /appointments/available-slots.
 * `slots` are ISO start times in UTC of every free 30-minute block that can
 * host the requested service without overlapping any existing appointment or
 * BlockedTime for the given barber on the given date.
 */
export interface AvailableSlotsResponse {
  date: string;
  barberId: string;
  serviceId: string;
  serviceDuration: number;
  slotIntervalMinutes: number;
  slots: string[];
}

/**
 * Weekly recurring availability window for a barber.
 * Times are stored as minutes-from-midnight (0-1440), independent of timezone.
 */
export interface Schedule {
  id: string;
  dayOfWeek: number; // 0=Dom … 6=Sáb
  startMinutes: number;
  endMinutes: number;
  barberId: string;
  active: boolean;
}

/**
 * One-off blocked time on a barber's calendar (vacation, lunch break, etc.).
 * Times are ISO strings in UTC.
 */
export interface BlockedTime {
  id: string;
  startTime: string;
  endTime: string;
  reason: string | null;
  barberId: string;
  active: boolean;
}
