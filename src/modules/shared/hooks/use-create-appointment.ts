"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Appointment } from "@/modules/shared/types";

export interface CreateAppointmentInput {
  barberId: string;
  serviceId: string;
  startTime: string;
  customerId?: string;
  guestName?: string;
  guestPhone?: string;
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateAppointmentInput) => {
      const { data } = await api.post<Appointment>("/appointments", input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
