"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Appointment } from "@/modules/shared/types";

interface BarberAppointmentsFilter {
  barberId?: string;
  status?: string;
}

export function useBarberAppointments(filter: BarberAppointmentsFilter = {}) {
  return useQuery({
    queryKey: ["appointments", "barber", filter],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filter.barberId) params.barberId = filter.barberId;
      if (filter.status) params.status = filter.status;
      const { data } = await api.get<Appointment[]>("/appointments", { params });
      return data;
    },
  });
}
