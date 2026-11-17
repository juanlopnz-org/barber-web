"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/modules/shared/lib/api-client";

// ----------------------------------------------------------------------------
//  Types
// ----------------------------------------------------------------------------

export type WhatsappConnectionStatus =
  | "DISCONNECTED"
  | "CONNECTING"
  | "CONNECTED"
  | "QR_REQUIRED"
  | "LOGGED_OUT";

export interface WhatsappStatus {
  status: WhatsappConnectionStatus;
  connected: boolean;
  phoneNumber: string | null;
  lastError: string | null;
}

export interface WhatsappQr {
  dataUrl: string;
  raw: string;
}

export interface WhatsappPairingCode {
  code: string;
}

// ----------------------------------------------------------------------------
//  Queries
// ----------------------------------------------------------------------------

/**
 * Connection status of the linked WhatsApp device.
 *
 * The backend keeps the device alive on its own, so this is polled to
 * surface the state (and any error) to the administrator.
 */
export function useWhatsappStatus(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: async () => {
      const { data } = await api.post<WhatsappStatus>("/admin/whatsapp/status");
      return data;
    },
    refetchInterval: options?.refetchInterval ?? 15_000,
  });
}

/**
 * The pairing QR, as a PNG data URL.
 *
 * WhatsApp rotates the QR every few seconds, so the caller polls this while
 * the pairing screen is open.
 */
export function useWhatsappQr(enabled = true) {
  return useQuery({
    queryKey: ["whatsapp", "qr"],
    queryFn: async () => {
      const { data } = await api.post<WhatsappQr>("/admin/whatsapp/qr");
      return data;
    },
    enabled,
    refetchInterval: enabled ? 5_000 : false,
    retry: false,
  });
}

// ----------------------------------------------------------------------------
//  Mutations
// ----------------------------------------------------------------------------

/** Request an 8-digit code to link the device from the phone. */
export function useRequestWhatsappPairingCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      const { data } = await api.post<WhatsappPairingCode>(
        "/admin/whatsapp/pairing-code",
        { phoneNumber },
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp", "status"] });
    },
  });
}

/** Unlink the device and wipe the session stored in the database. */
export function useWhatsappLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ unlinked: true }>(
        "/admin/whatsapp/logout",
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp"] });
    },
  });
}
