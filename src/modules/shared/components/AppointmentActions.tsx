"use client";

import { CheckCircle2, UserX, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useUpdateAppointmentStatus,
  type OperationalStatus,
} from "@/modules/shared/hooks/use-update-appointment-status";
import type { Appointment } from "@/modules/shared/types";

export interface AppointmentActionsProps {
  appointment: Appointment;
  /** Hide the buttons (e.g. inside a collapsed row). */
  className?: string;
}

/**
 * Operational actions for a booked appointment: complete it, mark it as a
 * no-show or cancel it.
 *
 * Only `BOOKED` appointments admit these transitions — the API rejects any
 * other target, and the domain entity enforces the same precondition.
 *
 * The mutation hook lives inside the component so each row owns its own
 * pending state: clicking "Completar" only disables that row's buttons.
 */
export function AppointmentActions({
  appointment,
  className,
}: AppointmentActionsProps) {
  const updateStatus = useUpdateAppointmentStatus();
  const pending = updateStatus.isPending;

  if (appointment.status !== "BOOKED") return null;

  const run = (target: OperationalStatus) => {
    if (
      target === "CANCELLED" &&
      !window.confirm("¿Cancelar esta cita? Esta acción no se puede deshacer.")
    ) {
      return;
    }
    updateStatus.mutate({ appointmentId: appointment.id, status: target });
  };

  return (
    <div className={className ?? "inline-flex flex-wrap gap-1"}>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run("COMPLETED")}
        title="Marcar como completada"
      >
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Completar
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run("NO_SHOW")}
        title="Marcar como no asistió"
      >
        <UserX className="mr-1 h-3.5 w-3.5" /> No asistió
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run("CANCELLED")}
        title="Cancelar la cita"
        className="text-destructive hover:bg-destructive/10"
      >
        <XCircle className="mr-1 h-3.5 w-3.5" /> Cancelar
      </Button>
    </div>
  );
}
