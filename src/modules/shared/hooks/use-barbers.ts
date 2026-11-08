"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export interface CreateBarberInput {
  name: string;
  phone: string;
  password: string;
  barbershopId: string;
  specialty?: string;
  rating?: number;
  allowBarberChangeOnSwap?: boolean;
}

export interface CreateBarberAccountResponse {
  barber: Barber;
  initialPassword: string;
}

export function useCreateBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBarberInput) => {
      const { data } = await api.post<CreateBarberAccountResponse>(
        "/barbers",
        input,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}

export interface UpdateBarberInput {
  name?: string;
  specialty?: string | null;
  rating?: number;
  allowBarberChangeOnSwap?: boolean;
  active?: boolean;
}

export function useUpdateBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateBarberInput;
    }) => {
      const { data } = await api.patch<Barber>(`/barbers/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}

export function useDeleteBarber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<Barber>(`/barbers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] });
    },
  });
}
