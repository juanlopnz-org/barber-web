"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Appointment } from "@/modules/shared/types";

export function useMyAppointments() {
  return useQuery({
    queryKey: ["appointments", "me"],
    queryFn: async () => {
      const { data } = await api.get<Appointment[]>("/appointments/me");
      return data;
    },
  });
}
