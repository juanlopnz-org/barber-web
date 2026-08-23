"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Appointment, AppointmentStatus } from "@/modules/shared/types";

/**
 * Operational transitions exposed via PATCH /appointments/:id/status.
 * The backend rejects any other target status, so we restrict the type here
 * to give callers a clear compile-time error if they reach for the wrong one.
 */
export type OperationalStatus = Extract<
  AppointmentStatus,
  "CANCELLED" | "COMPLETED" | "NO_SHOW"
>;

interface UpdateStatusInput {
  appointmentId: string;
  status: OperationalStatus;
}

/**
 * Cancel / complete / mark-as-no-show a single appointment. Invalidates every
 * cached appointment list (mine, barber, all) so the new state shows up
 * everywhere without manual refetch.
 */
export function useUpdateAppointmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, status }: UpdateStatusInput) => {
      const { data } = await api.patch<Appointment>(
        `/appointments/${appointmentId}/status`,
        { status },
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate every appointment-list query variant we know about.
      void qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
