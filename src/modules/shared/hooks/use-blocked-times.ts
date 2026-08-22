"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { BlockedTime } from "@/modules/shared/types";

export interface UseBlockedTimesParams {
  barberId: string | null | undefined;
  from?: string;
  to?: string;
}

export function useBlockedTimes({
  barberId,
  from,
  to,
}: UseBlockedTimesParams) {
  return useQuery({
    queryKey: ["blocked-times", barberId, from ?? null, to ?? null],
    enabled: Boolean(barberId),
    queryFn: async () => {
      const { data } = await api.get<BlockedTime[]>(
        `/barbers/${barberId}/blocked-times`,
        { params: { from, to } },
      );
      return data;
    },
  });
}

export interface CreateBlockedTimeInput {
  startTime: string;
  endTime: string;
  reason?: string;
}

export function useCreateBlockedTime(barberId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBlockedTimeInput) => {
      const { data } = await api.post<BlockedTime>(
        `/barbers/${barberId}/blocked-times`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocked-times", barberId] });
      // A new block may invalidate cached available-slots.
      qc.invalidateQueries({ queryKey: ["available-slots"] });
    },
  });
}

export function useDeleteBlockedTime(barberId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/blocked-times/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocked-times", barberId] });
      qc.invalidateQueries({ queryKey: ["available-slots"] });
    },
  });
}