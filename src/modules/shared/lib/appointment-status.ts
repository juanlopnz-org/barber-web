import type { AppointmentStatus } from "@/modules/shared/types";

/**
 * Human-readable labels for every appointment status.
 *
 * Single source of truth so the same status is never rendered as
 * "BOOKED" in one view and "Confirmada" in another. Used across the admin
 * agenda, the barber dashboard/appointments screens and the customer panel.
 */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  BOOKED: "Confirmada",
  OFFERED: "Ofrecida",
  SWAP_PENDING: "Intercambio pendiente",
  SWAP_MATCHED: "Intercambio listo",
  TRANSFERRED: "Transferida",
  COMPLETED: "Completada",
  NO_SHOW: "No asistió",
  CANCELLED: "Cancelada",
};

/** Tailwind classes for the status pill, per status. */
export const APPOINTMENT_STATUS_BADGE: Record<AppointmentStatus, string> = {
  BOOKED: "bg-primary/15 text-primary",
  OFFERED: "bg-warning/15 text-warning",
  SWAP_PENDING: "bg-warning/20 text-warning",
  SWAP_MATCHED: "bg-success/20 text-success",
  TRANSFERRED: "bg-secondary/20 text-secondary",
  COMPLETED: "bg-success/15 text-success",
  NO_SHOW: "bg-destructive/15 text-destructive",
  CANCELLED: "bg-destructive/10 text-destructive",
};

/** Translate an appointment status into its Spanish label. */
export function appointmentStatusLabel(status: AppointmentStatus): string {
  return APPOINTMENT_STATUS_LABELS[status] ?? status;
}

/**
 * Options for the status filter dropdowns. `ALL` means "no status filter".
 */
export const APPOINTMENT_STATUS_FILTER_OPTIONS: {
  value: AppointmentStatus | "ALL";
  label: string;
}[] = [
  { value: "ALL", label: "Todas" },
  { value: "BOOKED", label: APPOINTMENT_STATUS_LABELS.BOOKED },
  { value: "COMPLETED", label: APPOINTMENT_STATUS_LABELS.COMPLETED },
  { value: "CANCELLED", label: APPOINTMENT_STATUS_LABELS.CANCELLED },
  { value: "NO_SHOW", label: APPOINTMENT_STATUS_LABELS.NO_SHOW },
];
