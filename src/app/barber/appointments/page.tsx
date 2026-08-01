import { Calendar, Clock3, Scissors, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  barberAppointments,
  customerDirectory,
} from "@/modules/barber/data/appointments";
import { guestServices } from "@/modules/guest/data/mock";
import type { AppointmentStatus } from "@/modules/shared/types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  BOOKED: "Confirmada",
  OFFERED: "Ofrecida para swap",
  SWAP_PENDING: "Swap pendiente",
  SWAP_MATCHED: "Swap asignado",
  TRANSFERRED: "Transferida",
  COMPLETED: "Completada",
  NO_SHOW: "No show",
  CANCELLED: "Cancelada",
};

const STATUS_CLASSES: Record<AppointmentStatus, string> = {
  BOOKED: "bg-primary/15 text-foreground",
  OFFERED: "bg-accent text-foreground",
  SWAP_PENDING: "bg-warning/15 text-warning",
  SWAP_MATCHED: "bg-success/15 text-success",
  TRANSFERRED: "bg-secondary/15 text-secondary",
  COMPLETED: "bg-success/15 text-success",
  NO_SHOW: "bg-destructive/15 text-destructive",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const FILTERS: Array<{ key: string; label: string; matches: AppointmentStatus[] }> = [
  { key: "all", label: "Todas", matches: [] },
  {
    key: "today",
    label: "Hoy",
    matches: ["BOOKED", "OFFERED", "SWAP_PENDING", "SWAP_MATCHED", "TRANSFERRED"],
  },
  {
    key: "active",
    label: "Activas",
    matches: ["BOOKED", "SWAP_PENDING", "OFFERED"],
  },
  { key: "history", label: "Histórico", matches: ["COMPLETED", "CANCELLED", "NO_SHOW"] },
];

const todayKey = "2026-07-11";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function customerName(customerId?: string | null) {
  if (!customerId) return "Cliente";
  return customerDirectory[customerId] ?? `Cliente ${customerId}`;
}

function serviceName(serviceId: string) {
  return guestServices.find((service) => service.id === serviceId)?.name ?? "Servicio";
}

function serviceDuration(serviceId: string) {
  return guestServices.find((service) => service.id === serviceId)?.duration ?? 0;
}

export default function BarberAppointmentsPage() {
  const sorted = [...barberAppointments].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const todayCount = sorted.filter(
    (apt) => apt.startTime.startsWith(todayKey) && apt.status !== "CANCELLED"
  ).length;

  const pendingCount = sorted.filter(
    (apt) =>
      apt.status === "SWAP_PENDING" || apt.status === "OFFERED" || apt.status === "TRANSFERRED"
  ).length;

  const completedCount = sorted.filter((apt) => apt.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-secondary">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Citas para hoy</span>
            </div>
            <p className="mt-3 text-4xl font-semibold text-foreground">{todayCount}</p>
            <p className="mt-1 text-sm text-secondary">11 de julio · {todayKey.split("-").reverse().join("/")}</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-secondary">
              <Clock3 className="h-5 w-5" />
              <span className="text-sm font-medium">Pendientes de acción</span>
            </div>
            <p className="mt-3 text-4xl font-semibold text-foreground">{pendingCount}</p>
            <p className="mt-1 text-sm text-secondary">Swaps, ofertas y transferencias</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-secondary">
              <Scissors className="h-5 w-5" />
              <span className="text-sm font-medium">Servicios finalizados</span>
            </div>
            <p className="mt-3 text-4xl font-semibold text-foreground">{completedCount}</p>
            <p className="mt-1 text-sm text-secondary">Últimos 30 días</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/70 bg-white/88">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Listado de citas</CardTitle>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <span
                key={filter.key}
                className={
                  filter.key === "today"
                    ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft"
                    : "rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-secondary"
                }
              >
                {filter.label}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white/82 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 items-start gap-4">
                <div className="rounded-2xl bg-accent px-4 py-3 text-center">
                  <p className="text-xs font-medium text-secondary">{formatDate(apt.startTime)}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {formatTime(apt.startTime)}
                  </p>
                  <p className="mt-1 text-xs text-secondary">{serviceDuration(apt.serviceId)} min</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-secondary" />
                    <p className="font-semibold text-foreground">
                      {customerName(apt.customerId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Scissors className="h-4 w-4" />
                    {serviceName(apt.serviceId)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASSES[apt.status]}`}
                    >
                      {STATUS_LABELS[apt.status]}
                    </span>
                    {apt.status === "SWAP_PENDING" ? (
                      <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                        Esperando match
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  Ver detalle
                </Button>
                {apt.status === "BOOKED" ? (
                  <Button size="sm">Iniciar</Button>
                ) : null}
                {apt.status === "OFFERED" ? (
                  <Button size="sm">Aceptar</Button>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}