"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { Service } from "@/modules/shared/types";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await api.get<Service[]>("/services");
      return data;
    },
  });
}
