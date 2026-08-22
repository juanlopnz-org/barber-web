"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export interface CreateServiceInput {
  name: string;
  duration: number;
  price: number;
  barbershopId: string;
  active?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  duration?: number;
  price?: number;
  barbershopId?: string;
  active?: boolean;
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const { data } = await api.post<Service>("/services", input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateServiceInput;
    }) => {
      const { data } = await api.patch<Service>(`/services/${id}`, input);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<Service>(`/services/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
