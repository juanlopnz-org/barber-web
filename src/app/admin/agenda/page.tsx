"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Filter,
  Loader2,
  UserX,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAllAppointments } from "@/modules/shared/hooks/use-all-appointments";
import {
  useUpdateAppointmentStatus,
  type OperationalStatus,
} from "@/modules/shared/hooks/use-update-appointment-status";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useServices } from "@/modules/shared/hooks/use-services";
import type { Appointment, AppointmentStatus } from "@/modules/shared/types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  BOOKED: "Confirmada",
  OFFERED: "Ofrecida",
  SWAP_PENDING: "Swap pendiente",
  SWAP_MATCHED: "Swap listo",
  TRANSFERRED: "Transferida",
  COMPLETED: "Completada",
  NO_SHOW: "No show",
  CANCELLED: "Cancelada",
};

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  BOOKED: "bg-primary/15 text-primary",
  OFFERED: "bg-warning/15 text-warning",
  SWAP_PENDING: "bg-warning/20 text-warning",
  SWAP_MATCHED: "bg-success/20 text-success",
  TRANSFERRED: "bg-secondary/20 text-secondary",
  COMPLETED: "bg-success/15 text-success",
  NO_SHOW: "bg-destructive/15 text-destructive",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const STATUS_FILTER_OPTIONS: { value: AppointmentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas" },
  { value: "BOOKED", label: "Confirmadas" },
  { value: "COMPLETED", label: "Completadas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "NO_SHOW", label: "No show" },
];

/** Format an ISO timestamp as HH:MM in es-CO locale (24h). */
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Format an ISO timestamp as DD/MM/YYYY in es-CO locale. */
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Returns YYYY-MM-DD for today in local time, used as the default date filter. */
function todayLocalISODate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns YYYY-MM-DD for a Date offset by `days` (negative = past). */
function shiftISODate(baseISO: string, days: number): string {
  const d = new Date(`${baseISO}T00:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AdminAgendaPage() {
  // Default to today ± 7 days so the page shows the operational week
  // immediately on load. Backend interprets `from`/`to` in UTC.
  const [fromDate, setFromDate] = useState<string>(shiftISODate(todayLocalISODate(), -7));
  const [toDate, setToDate] = useState<string>(shiftISODate(todayLocalISODate(), 7));
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");

  const filter = useMemo(
    () => ({
      from: fromDate,
      to: toDate,
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
    }),
    [fromDate, toDate, statusFilter],
  );

  const { data: appointments = [], isLoading } = useAllAppointments(filter);
  const { data: barbers = [] } = useBarbers();
  const { data: services = [] } = useServices();
  const updateStatus = useUpdateAppointmentStatus();

  const barberName = (id: string) => barbers.find((b) => b.id === id)?.name ?? "—";
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";
  const customerLabel = (apt: Appointment): string => {
    if (apt.guestName) return `${apt.guestName} (invitado)`;
    if (apt.customerId) return `Cliente ${apt.customerId.slice(0, 8)}`;
    return "Cliente";
  };

  // Summary counters (computed from the same filtered list)
  const summary = useMemo(() => {
    const acc = { booked: 0, completed: 0, cancelled: 0, noShow: 0 };
    for (const a of appointments) {
      if (a.status === "BOOKED") acc.booked++;
      else if (a.status === "COMPLETED") acc.completed++;
      else if (a.status === "CANCELLED") acc.cancelled++;
      else if (a.status === "NO_SHOW") acc.noShow++;
    }
    return acc;
  }, [appointments]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Agenda global</h1>
        <p className="text-secondary">
          Citas de todos los barberos en el rango seleccionado. Cancela o completa
          desde la tabla; los cambios se reflejan en los slots disponibles al instante.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-4">
        <SummaryCard label="Confirmadas" value={summary.booked} icon={Calendar} accent="text-primary" />
        <SummaryCard label="Completadas" value={summary.completed} icon={CheckCircle2} accent="text-success" />
        <SummaryCard label="Canceladas" value={summary.cancelled} icon={XCircle} accent="text-destructive" />
        <SummaryCard label="No show" value={summary.noShow} icon={UserX} accent="text-destructive" />
      </div>

      <Card className="border-white/70 bg-white/88">
        <CardHeader className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4 text-secondary" />
              Filtros
            </CardTitle>
            <p className="text-xs text-secondary">
              Las fechas se interpretan en hora local (America/Bogota).
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <DateField label="Desde" value={fromDate} onChange={setFromDate} />
            <DateField label="Hasta" value={toDate} onChange={setToDate} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-secondary">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | "ALL")}
                className="h-9 rounded-xl border border-border bg-white/82 px-3 text-sm"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando citas…
            </div>
          ) : appointments.length === 0 ? (
            <p className="p-10 text-center text-sm text-secondary">
              No hay citas en el rango seleccionado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-[0.16em] text-secondary">
                    <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                    <th className="px-4 py-3 text-left font-semibold">Hora</th>
                    <th className="px-4 py-3 text-left font-semibold">Barbero</th>
                    <th className="px-4 py-3 text-left font-semibold">Servicio</th>
                    <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                    <th className="px-4 py-3 text-left font-semibold">Estado</th>
                    <th className="px-4 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-secondary">{fmtDate(apt.startTime)}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5 text-secondary" />
                          {fmtTime(apt.startTime)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{barberName(apt.barberId)}</td>
                      <td className="px-4 py-3">{serviceName(apt.serviceId)}</td>
                      <td className="px-4 py-3 text-secondary">{customerLabel(apt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                            (STATUS_BADGE[apt.status] ?? "bg-muted text-secondary")
                          }
                        >
                          {STATUS_LABELS[apt.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RowActions
                          appointment={apt}
                          pending={updateStatus.isPending}
                          onMutate={(target) =>
                            updateStatus.mutate({ appointmentId: apt.id, status: target })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RowActions({
  appointment,
  pending,
  onMutate,
}: {
  appointment: Appointment;
  pending: boolean;
  onMutate: (target: OperationalStatus) => void;
}) {
  // Only BOOKED appointments admit operational transitions. The other states
  // are terminal-ish for the admin UI.
  if (appointment.status !== "BOOKED") {
    return <span className="text-xs text-secondary">—</span>;
  }
  return (
    <div className="inline-flex gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => onMutate("COMPLETED")}
        title="Marcar como completada"
      >
        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Completar
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => onMutate("NO_SHOW")}
        title="Marcar como no-show"
      >
        <UserX className="mr-1 h-3.5 w-3.5" /> No show
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => onMutate("CANCELLED")}
        title="Cancelar la cita"
        className="text-destructive hover:bg-destructive/10"
      >
        <XCircle className="mr-1 h-3.5 w-3.5" /> Cancelar
      </Button>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-secondary">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-xl border border-border bg-white/82 px-3 text-sm"
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Calendar;
  accent: string;
}) {
  return (
    <Card className="border-white/70 bg-white/88">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-secondary">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        </div>
        <Icon className={`h-6 w-6 ${accent}`} />
      </CardContent>
    </Card>
  );
}
