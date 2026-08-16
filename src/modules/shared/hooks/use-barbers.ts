"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Barber } from "@/modules/shared/types";

export function useBarbers() {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: async () => {
      const { data } = await api.get<Barber[]>("/barbers");
      return data;
    },
  });
}
