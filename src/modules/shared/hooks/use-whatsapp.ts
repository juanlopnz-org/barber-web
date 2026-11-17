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

export type WhatsappPairingOutcome =
  | "NONE"
  | "PENDING"
  | "COMPLETED"
  | "FAILED";

export interface WhatsappStatus {
  status: WhatsappConnectionStatus;
  connected: boolean;
  phoneNumber: string | null;
  lastError: string | null;
  /** The pairing attempt waiting for the phone, when there is one. */
  pairing: WhatsappPairingState | null;
  /** Outcome of the last pairing attempt. */
  pairingOutcome: WhatsappPairingOutcome;
  /**
   * Whether the pending pairing code can still be used.
   *
   * A code is registered against the connection that requested it, so it
   * stops working as soon as the socket drops (or when WhatsApp expires it).
   */
  pairingValid: boolean;
}

export interface WhatsappPairingState {
  /** E.164 number the code was requested for, e.g. `+573001234567`. */
  phoneNumber: string;
  /** When the code was issued (epoch milliseconds). */
  requestedAt: number;
}

export interface WhatsappQr {
  dataUrl: string;
  raw: string;
}

export interface WhatsappPairingCode {
  /** The 8-digit code to type on the phone. */
  code: string;
  /**
   * The exact number to type on the phone before the code.
   *
   * WhatsApp asks for the number first and rejects the code when it does not
   * match the one the code was issued for.
   */
  phoneNumber: string;
  requestedAt: number;
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
 * How often the status is polled while a pairing code is pending.
 *
 * A code only works while the connection that requested it stays up, so the
 * panel has to notice quickly when it dies.
 */
const PAIRING_POLL_INTERVAL_MS = 5_000;

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
      if (status === "CONNECTED") {
        return STATUS_POLL_INTERVAL_CONNECTED_MS;
      }
      // A pending pairing code is time-sensitive: the connection may drop at
      // any moment and take the code with it.
      if (query.state.data?.pairing) {
        return PAIRING_POLL_INTERVAL_MS;
      }
      return STATUS_POLL_INTERVAL_MS;
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

/**
 * Discard the pending pairing attempt and start over.
 *
 * Drops the identity a failed pairing left behind and reconnects, so a fresh
 * QR (and a fresh pairing code) becomes available.
 */
export function useResetWhatsappPairing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ reset: true }>(
        "/admin/whatsapp/reset-pairing",
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["whatsapp"] });
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
