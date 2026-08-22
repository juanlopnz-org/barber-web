"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";

/**
 * Lightweight projection of a Barbershop. The backend doesn't expose a
 * full CRUD yet, but every service and barber is linked to one — so we
 * infer the (likely single) barbershopId by reading the first active
 * service or the first active barber. This is enough for the admin
 * service creation form, which currently only has one barbershop.
 *
 * Will be replaced by a real `useBarbershops()` once the
 * `Barbershop` CRUD endpoint lands (already pending in the backlog).
 */
export function useDefaultBarbershopId(): {
  barbershopId: string | null;
  loading: boolean;
} {
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await api.get<
        Array<{ id: string; barbershopId: string; active: boolean }>
      >("/services");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const barbershopId = services[0]?.barbershopId ?? null;

  return {
    barbershopId,
    loading: loadingServices,
  };
}