"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";
import type { RecurringBooking } from "@/modules/shared/types";

export interface CreateRecurringBookingInput {
  customerPhone: string;
  customerName: string;
  barberId: string;
  serviceId: string;
  dayOfWeek: number;
  timeMinutes: number;
  startsOn: string; // YYYY-MM-DD
  endsOn: string;
}

export interface UpdateRecurringBookingInput {
  id: string;
  endsOn: string;
}

/** List every active recurring booking (admin view). */
export function useRecurringBookings() {
  return useQuery({
    queryKey: ["recurring-bookings"],
    queryFn: async () => {
      const { data } = await api.get<RecurringBooking[]>("/admin/recurring-bookings");
      return data;
    },
  });
}

/** Get a single recurring booking by id. */
export function useRecurringBooking(id: string | undefined) {
  return useQuery({
    queryKey: ["recurring-bookings", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get<RecurringBooking>(`/admin/recurring-bookings/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}

/** Create a new series + materialize first window. */
export function useCreateRecurringBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRecurringBookingInput) => {
      const { data } = await api.post<RecurringBooking>(
        "/admin/recurring-bookings",
        input,
      );
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recurring-bookings"] });
      // The materialization pass writes real Appointment rows; invalidate the
      // agenda cache so the new bookings show up everywhere.
      void qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

/** Push the materialized window forward. Idempotent. */
export function useRefreshRecurringBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<RecurringBooking>(
        `/admin/recurring-bookings/${id}/refresh`,
      );
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recurring-bookings"] });
      void qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateRecurringBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, endsOn }: UpdateRecurringBookingInput) => {
      const { data } = await api.patch<RecurringBooking>(
        `/admin/recurring-bookings/${id}`,
        { endsOn },
      );
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recurring-bookings"] });
      void qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

/** Cancel a series + every future BOOKED occurrence. */
export function useCancelRecurringBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<{
        cancelled: true;
        cancelledAppointments: number;
      }>(`/admin/recurring-bookings/${id}`);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recurring-bookings"] });
      void qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
