"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Schedule } from "@/modules/shared/types";

export interface CreateScheduleInput {
  dayOfWeek: number;
  startMinutes: number;
  endMinutes: number;
  active?: boolean;
}

export interface UpdateScheduleInput {
  dayOfWeek?: number;
  startMinutes?: number;
  endMinutes?: number;
  active?: boolean;
}

export function useSchedules(barberId: string | null | undefined) {
  return useQuery({
    queryKey: ["schedules", barberId],
    enabled: Boolean(barberId),
    queryFn: async () => {
      const { data } = await api.get<Schedule[]>(
        `/barbers/${barberId}/schedules`,
      );
      return data;
    },
  });
}

export function useCreateSchedule(barberId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateScheduleInput) => {
      const { data } = await api.post<Schedule>(
        `/barbers/${barberId}/schedules`,
        input,
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules", barberId] });
    },
  });
}

export function useUpdateSchedule(barberId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateScheduleInput;
    }) => {
      const { data } = await api.patch<Schedule>(`/schedules/${id}`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules", barberId] });
    },
  });
}

export function useDeleteSchedule(barberId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/schedules/${id}`);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["schedules", barberId] });
    },
  });
}