"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Appointment, AppointmentStatus } from "@/modules/shared/types";

/**
 * Filter shape accepted by GET /appointments. All fields are optional; the
 * query key includes every field so that React Query caches each combination
 * independently and a filter change automatically refetches.
 */
export interface AllAppointmentsFilter {
  barberId?: string;
  customerId?: string;
  status?: AppointmentStatus;
  /** ISO date or timestamp (inclusive lower bound on startTime). */
  from?: string;
  /** ISO date or timestamp (exclusive upper bound on startTime). */
  to?: string;
}

function buildParams(filter: AllAppointmentsFilter): Record<string, string> {
  const params: Record<string, string> = {};
  if (filter.barberId) params.barberId = filter.barberId;
  if (filter.customerId) params.customerId = filter.customerId;
  if (filter.status) params.status = filter.status;
  if (filter.from) params.from = filter.from;
  if (filter.to) params.to = filter.to;
  return params;
}

/**
 * Admin/Barber facing appointment list. Used by /admin/agenda and any other
 * surface that needs the full appointments table filtered by barbero / rango
 * / estado.
 */
export function useAllAppointments(filter: AllAppointmentsFilter = {}) {
  return useQuery({
    queryKey: ["appointments", "all", filter],
    queryFn: async () => {
      const { data } = await api.get<Appointment[]>("/appointments", {
        params: buildParams(filter),
      });
      return data;
    },
  });
}
