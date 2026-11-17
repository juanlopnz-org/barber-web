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
//  Polling cadence
// ----------------------------------------------------------------------------

/**
 * How often the connection status is polled while the device is not linked.
 *
 * Fast enough to notice that the admin just scanned the QR, slow enough to
 * stay cheap: the panel only needs to refresh every half minute to tell
 * "waiting" from "linked".
 */
const STATUS_POLL_INTERVAL_MS = 30_000;

/**
 * How often the status is polled once the device is linked.
 *
 * Nothing changes at that point, so the panel can settle down.
 */
const STATUS_POLL_INTERVAL_CONNECTED_MS = 60_000;

/**
 * How often the pairing QR is refreshed.
 *
 * WhatsApp rotates the QR every ~20 seconds and the endpoint always returns
 * the current one, so polling faster than that only burns requests (each
 * call renders a PNG on the server).
 */
const QR_POLL_INTERVAL_MS = 20_000;

// ----------------------------------------------------------------------------
//  Queries
// ----------------------------------------------------------------------------

/**
 * Connection status of the linked WhatsApp device.
 *
 * The backend keeps the device alive on its own, so this is polled to
 * surface the state (and any error) to the administrator.
 *
 * The request is a background poll: `feedback: false` keeps it from
 * triggering the global loading indicator and a toast on every tick.
 */
export function useWhatsappStatus(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: async () => {
      const { data } = await api.post<WhatsappStatus>(
        "/admin/whatsapp/status",
        undefined,
        { feedback: false },
      );
      return data;
    },
    refetchInterval: (query) => {
      if (options?.refetchInterval) return options.refetchInterval;
      // Poll faster while the device still needs to be linked, and settle
      // down once it is connected.
      const status = query.state.data?.status;
      return status === "CONNECTED"
        ? STATUS_POLL_INTERVAL_CONNECTED_MS
        : STATUS_POLL_INTERVAL_MS;
    },
    staleTime: STATUS_POLL_INTERVAL_MS,
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
      const { data } = await api.post<WhatsappQr>(
        "/admin/whatsapp/qr",
        undefined,
        { feedback: false },
      );
      return data;
    },
    enabled,
    refetchInterval: enabled ? QR_POLL_INTERVAL_MS : false,
    staleTime: QR_POLL_INTERVAL_MS,
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
