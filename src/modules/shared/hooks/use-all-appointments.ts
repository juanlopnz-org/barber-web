"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type {
  AppointmentStatus,
  PaginatedAppointments,
} from "@/modules/shared/types";

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
  /** 1-based page number. */
  page?: number;
  /** Rows per page (1-100). */
  pageSize?: number;
  /** Sort order by startTime. */
  order?: "asc" | "desc";
}

function buildParams(filter: AllAppointmentsFilter): Record<string, string> {
  const params: Record<string, string> = {};
  if (filter.barberId) params.barberId = filter.barberId;
  if (filter.customerId) params.customerId = filter.customerId;
  if (filter.status) params.status = filter.status;
  if (filter.from) params.from = filter.from;
  if (filter.to) params.to = filter.to;
  if (filter.page !== undefined) params.page = String(filter.page);
  if (filter.pageSize !== undefined) params.pageSize = String(filter.pageSize);
  if (filter.order) params.order = filter.order;
  return params;
}

/**
 * Admin/Barber facing appointment list. Used by /admin/agenda and any other
 * surface that needs the full appointments table filtered by barbero / rango
 * / estado.
 *
 * Returns the paginated envelope: `{ items, total, page, pageSize,
 * totalPages, summary }`.
 */
export function useAllAppointments(filter: AllAppointmentsFilter = {}) {
  return useQuery({
    queryKey: ["appointments", "all", filter],
    queryFn: async () => {
      const { data } = await api.get<PaginatedAppointments>("/appointments", {
        params: buildParams(filter),
      });
      return data;
    },
  });
}
