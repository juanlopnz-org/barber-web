"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LogOut,
  MessageCircle,
  QrCode,
  RefreshCw,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useRequestWhatsappPairingCode,
  useResetWhatsappPairing,
  useWhatsappLogout,
  useWhatsappQr,
  useWhatsappStatus,
  type WhatsappConnectionStatus,
} from "@/modules/shared/hooks/use-whatsapp";

// ----------------------------------------------------------------------------
//  Presentation helpers
// ----------------------------------------------------------------------------

const STATUS_LABEL: Record<WhatsappConnectionStatus, string> = {
  CONNECTED: "Conectado",
  CONNECTING: "Conectando…",
  QR_REQUIRED: "Vinculación pendiente",
  DISCONNECTED: "Desconectado",
  LOGGED_OUT: "Sesión cerrada",
};

const STATUS_STYLE: Record<WhatsappConnectionStatus, string> = {
  CONNECTED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  CONNECTING: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  QR_REQUIRED: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  DISCONNECTED: "bg-white/10 text-white/70 border-white/15",
  LOGGED_OUT: "bg-red-500/15 text-red-300 border-red-500/30",
};

/**
 * Why the device cannot be paired yet, in words the admin can act on.
 *
 * A pairing code is only accepted once the device registered itself with
 * WhatsApp and is waiting for a phone; asking for it earlier is rejected.
 */
const NOT_READY_HINT: Record<string, string> = {
  CONNECTING:
    "El dispositivo todavía está conectando con WhatsApp. Espera a que aparezca el código QR.",
  DISCONNECTED:
    "El dispositivo se desconectó de WhatsApp. Espera a que vuelva a aparecer el código QR.",
  LOGGED_OUT:
    "La sesión de WhatsApp está cerrada. Desvincula el número y vuelve a vincularlo.",
  CONNECTED:
    "El número ya está vinculado. Desvincúlalo antes de vincular otro.",
};

// ----------------------------------------------------------------------------
//  Page
// ----------------------------------------------------------------------------

export default function AdminWhatsappPage() {
  const statusQuery = useWhatsappStatus();
  const status = statusQuery.data;

  // The QR is only worth polling while the device is waiting to be linked.
  const awaitingLink =
    status?.status === "QR_REQUIRED" || status?.status === "DISCONNECTED";
  const qrQuery = useWhatsappQr(awaitingLink);

  const pairingCode = useRequestWhatsappPairingCode();
  const resetPairing = useResetWhatsappPairing();
  const logout = useWhatsappLogout();

  const [phoneNumber, setPhoneNumber] = useState("");
  // Client-side timestamp of the moment the code reached the browser, used to
  // tell "the code died" apart from "the status has not been refreshed yet".
  const [codeReceivedAt, setCodeReceivedAt] = useState<number | null>(null);

  const isConnected = status?.status === "CONNECTED";
  const isReadyToPair = status?.status === "QR_REQUIRED";

  async function onRequestPairingCode(event: React.FormEvent) {
    event.preventDefault();
    if (!phoneNumber.trim()) return;
    const result = await pairingCode.mutateAsync(phoneNumber.trim());
    setCodeReceivedAt(Date.now());
    // The number that has to be typed on the phone is the normalized one.
    setPhoneNumber(result.phoneNumber);
  }

  async function onResetPairing() {
    await resetPairing.mutateAsync();
    setCodeReceivedAt(null);
    pairingCode.reset();
  }

  async function onLogout() {
    if (
      !window.confirm(
        "¿Desvincular el número de WhatsApp? Se borrará la sesión guardada y habrá que vincular de nuevo.",
      )
    ) {
      return;
    }
    await logout.mutateAsync();
  }

  const displayedCode = pairingCode.data?.code;

  // The code stops working when the connection that registered it drops (or
  // when WhatsApp expires it). The status has to be refreshed *after* the
  // code arrived, otherwise a stale status would flag a brand new code.
  const statusRefreshedAfterCode =
    codeReceivedAt !== null &&
    (statusQuery.dataUpdatedAt ?? 0) > codeReceivedAt;
  const codeIsStale =
    Boolean(displayedCode) &&
    statusRefreshedAfterCode &&
    status?.pairingValid === false;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">WhatsApp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vincula el número que enviará los recordatorios de cita. La sesión se
          guarda en la base de datos, no en el disco del servidor.
        </p>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/*  Connection status                                              */}
      {/* ---------------------------------------------------------------- */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4" />
            Estado de la conexión
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Actualizar estado"
            onClick={() => statusQuery.refetch()}
            disabled={statusQuery.isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${statusQuery.isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusQuery.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Consultando el estado…
            </div>
          ) : statusQuery.isError ? (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              No se pudo consultar el estado del servicio de WhatsApp.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    STATUS_STYLE[status!.status] ?? STATUS_STYLE.DISCONNECTED
                  }`}
                >
                  {STATUS_LABEL[status!.status] ?? status!.status}
                </span>
                {status!.phoneNumber ? (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    {status!.phoneNumber}
                  </span>
                ) : null}
              </div>

              {status!.lastError ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  {status!.lastError}
                </div>
              ) : null}

              {isConnected ? (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  El dispositivo está listo para enviar recordatorios.
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/*  Pairing                                                       */}
      {/* ---------------------------------------------------------------- */}
      {!isConnected ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <QrCode className="h-4 w-4" />
                Vincular con QR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrQuery.data?.dataUrl ? (
                <div className="flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrQuery.data.dataUrl}
                    alt="Código QR de vinculación de WhatsApp"
                    className="h-64 w-64 rounded-2xl bg-white p-3"
                  />
                  <p className="text-center text-sm text-muted-foreground">
                    Abre WhatsApp → <strong>Dispositivos vinculados</strong> →
                    <strong> Vincular con QR</strong> y escanea este código.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {qrQuery.isLoading
                    ? "Esperando el código QR…"
                    : "El código QR aparecerá en cuanto el dispositivo esté listo. Si no aparece, reinicia el servicio de la API."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="h-4 w-4" />
                Vincular con código
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-3" onSubmit={onRequestPairingCode}>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="+573001234567"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  aria-label="Número de WhatsApp"
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    pairingCode.isPending || !phoneNumber.trim() || !isReadyToPair
                  }
                >
                  {pairingCode.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Solicitar código
                </Button>
              </form>

              {!isReadyToPair && status ? (
                <p className="text-xs text-muted-foreground">
                  {NOT_READY_HINT[status.status] ??
                    "El dispositivo todavía no está listo para vincularse."}
                </p>
              ) : null}

              {pairingCode.data?.code ? (
                <div className="space-y-3">
                  <div
                    className={`rounded-xl border p-4 text-center ${
                      codeIsStale
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-sky-500/30 bg-sky-500/10"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground">
                      Ingresa este código en el teléfono:
                    </p>
                    <p className="mt-2 font-mono text-2xl font-bold tracking-[0.3em] text-sky-200">
                      {pairingCode.data.code}
                    </p>
                  </div>

                  {codeIsStale ? (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                      Este código ya no sirve: la conexión con WhatsApp se
                      cortó o el código expiró. Solicita uno nuevo.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
                      <p>
                        En el teléfono: WhatsApp →{" "}
                        <strong>Dispositivos vinculados</strong> →{" "}
                        <strong>Vincular con número de teléfono</strong>.
                      </p>
                      <p className="mt-2">
                        Escribe primero el número{" "}
                        <strong className="text-foreground">
                          {pairingCode.data.phoneNumber}
                        </strong>{" "}
                        (con el código de país) y después el código de 8
                        dígitos. Si el número no coincide, WhatsApp responde
                        «código incorrecto».
                      </p>
                    </div>
                  )}
                </div>
              ) : null}

              {pairingCode.isError ? (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  No se pudo generar el código de emparejamiento.
                </div>
              ) : null}

              <Button
                variant="outline"
                className="w-full"
                onClick={onResetPairing}
                disabled={resetPairing.isPending}
              >
                {resetPairing.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4" />
                )}
                Reiniciar vinculación
              </Button>
              <p className="text-xs text-muted-foreground">
                Descarta el intento de emparejamiento actual y genera un
                código QR y un código nuevos.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */}
      {/*  Danger zone                                                    */}
      {/* ---------------------------------------------------------------- */}
      {isConnected ? (
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base text-red-300">
              Desvincular número
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Borra la sesión guardada en la base de datos. Los recordatorios
              dejarán de enviarse hasta volver a vincular el número.
            </p>
            <Button
              variant="outline"
              onClick={onLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Desvincular
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
