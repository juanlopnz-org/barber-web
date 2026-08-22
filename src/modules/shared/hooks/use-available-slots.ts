"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { AvailableSlotsResponse } from "@/modules/shared/types";

export interface UseAvailableSlotsParams {
  barberId: string;
  /** Calendar date in YYYY-MM-DD (UTC). */
  date: string;
  serviceId: string;
  /** When false, the query is disabled and returns no data. */
  enabled?: boolean;
}

/**
 * Fetch available 30-minute slots for a given barber on a given date that
 * can host the requested service. The query is only enabled when the three
 * required parameters are non-empty.
 */
export function useAvailableSlots({
  barberId,
  date,
  serviceId,
  enabled = true,
}: UseAvailableSlotsParams) {
  const ready = Boolean(barberId && date && serviceId) && enabled;

  return useQuery({
    queryKey: ["available-slots", barberId, date, serviceId],
    enabled: ready,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const { data } = await api.get<AvailableSlotsResponse>(
        "/appointments/available-slots",
        { params: { barberId, date, serviceId } },
      );
      return data;
    },
  });
}