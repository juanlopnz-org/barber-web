"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import { useSessionStore } from "@/store/session-store";
import type {
  AppointmentStatus,
  PaginatedAppointments,
} from "@/modules/shared/types";

export interface BarberAppointmentsFilter {
  barberId?: string;
  status?: AppointmentStatus;
  /** ISO date or timestamp (inclusive lower bound on startTime). */
  from?: string;
  /** ISO date or timestamp (exclusive upper bound on startTime). */
  to?: string;
  /** 1-based page number. */
  page?: number;
  /** Rows per page (1-100). */
  pageSize?: number;
  /** Sort order by startTime. */
  order?: "asc" | "desc";
}

/**
 * Appointments of the signed-in barber.
 *
 * The API always scopes the result to the barber linked to the JWT, so the
 * `barberId` filter is only used to keep the React Query cache key unique
 * per barber (it is sent as a query param too, but the backend ignores it
 * for the BARBER role).
 */
export function useBarberAppointments(filter: BarberAppointmentsFilter = {}) {
  const sessionBarberId = useSessionStore((state) => state.user.barberId);

  const barberId = filter.barberId ?? sessionBarberId ?? undefined;

  return useQuery({
    queryKey: ["appointments", "barber", { ...filter, barberId }],
    enabled: Boolean(barberId),
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (barberId) params.barberId = barberId;
      if (filter.status) params.status = filter.status;
      if (filter.from) params.from = filter.from;
      if (filter.to) params.to = filter.to;
      if (filter.page !== undefined) params.page = String(filter.page);
      if (filter.pageSize !== undefined) {
        params.pageSize = String(filter.pageSize);
      }
      if (filter.order) params.order = filter.order;

      const { data } = await api.get<PaginatedAppointments>("/appointments", {
        params,
      });
      return data;
    },
  });
}
