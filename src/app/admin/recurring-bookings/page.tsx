"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Phone,
  Plus,
  RefreshCw,
  Repeat,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useServices } from "@/modules/shared/hooks/use-services";
import {
  useCancelRecurringBooking,
  useCreateRecurringBooking,
  useRecurringBookings,
  useRefreshRecurringBooking,
  type CreateRecurringBookingInput,
} from "@/modules/shared/hooks/use-recurring-bookings";
import type { RecurringBooking } from "@/modules/shared/types";

const DAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const DAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Format minutes-since-midnight as HH:MM 24h. */
function fmtMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Return today + N days as YYYY-MM-DD in local time. */
function shiftDays(baseISO: string, days: number): string {
  const [y, m, d] = baseISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AdminRecurringBookingsPage() {
  const { data: recurring = [], isLoading } = useRecurringBookings();
  const { data: barbers = [] } = useBarbers();
  const { data: services = [] } = useServices();
  const createMut = useCreateRecurringBooking();
  const refreshMut = useRefreshRecurringBooking();
  const cancelMut = useCancelRecurringBooking();
  const [showCreate, setShowCreate] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<RecurringBooking | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reservas recurrentes
          </h1>
          <p className="mt-2 text-secondary">
            Agenda clientes en horarios semanales que se repiten automáticamente.
            Por ejemplo, "todos los sábados a las 6:30pm con Carlos". El sistema
            materializa las próximas semanas y deja que el cliente gestione las
            suyas desde su panel.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="lg">
          <Plus className="mr-2 h-4 w-4" /> Nueva reserva recurrente
        </Button>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-10 text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando…
        </div>
      ) : recurring.length === 0 ? (
        <Card className="border-white/70 bg-white/88">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center text-secondary">
            <Repeat className="h-10 w-10 opacity-40" />
            <p className="text-sm">
              Aún no tienes reservas recurrentes. Crea la primera con el botón
              de arriba.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {recurring.map((r) => (
            <RecurringCard
              key={r.id}
              series={r}
              onRefresh={() => refreshMut.mutate(r.id)}
              refreshing={refreshMut.isPending}
              onCancel={() => setPendingCancel(r)}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateDialog
          barbers={barbers}
          services={services}
          onClose={() => setShowCreate(false)}
          onSubmit={(input) =>
            createMut.mutate(input, { onSuccess: () => setShowCreate(false) })
          }
          submitting={createMut.isPending}
        />
      )}

      {pendingCancel && (
        <CancelDialog
          series={pendingCancel}
          onClose={() => setPendingCancel(null)}
          onConfirm={() =>
            cancelMut.mutate(pendingCancel.id, {
              onSuccess: () => setPendingCancel(null),
            })
          }
          submitting={cancelMut.isPending}
        />
      )}
    </div>
  );
}

function RecurringCard({
  series,
  onRefresh,
  refreshing,
  onCancel,
}: {
  series: RecurringBooking;
  onRefresh: () => void;
  refreshing: boolean;
  onCancel: () => void;
}) {
  return (
    <Card className="border-white/70 bg-white/88">
      <CardHeader className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Repeat className="h-4 w-4 text-primary" />
            Cada {DAY_LABELS[series.dayOfWeek]} a las {fmtMinutes(series.timeMinutes)}
          </CardTitle>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
            Activa
          </span>
        </div>
        <p className="text-xs text-secondary">
          Creada el {new Date(series.createdAt).toLocaleDateString("es-CO")}
        </p>
      </CardHeader>
      <CardContent className="space-y-3 p-4 text-sm">
        <Row icon={<Calendar className="h-3.5 w-3.5 text-secondary" />} label="Barbero">
          {series.barberName}
        </Row>
        <Row icon={<CalendarClock className="h-3.5 w-3.5 text-secondary" />} label="Servicio">
          {series.serviceName}
        </Row>
        <Row icon={<Phone className="h-3.5 w-3.5 text-secondary" />} label="Cliente">
          <span>
            {series.customerName ?? "(sin nombre)"} ·{" "}
            <span className="font-mono text-secondary">{series.customerPhone}</span>
          </span>
        </Row>
        <Row icon={<Calendar className="h-3.5 w-3.5 text-secondary" />} label="Periodo">
          {series.startsOn}
          {series.endsOn ? ` → ${series.endsOn}` : " → sin fin"}
        </Row>
        <Row icon={<Repeat className="h-3.5 w-3.5 text-secondary" />} label="Próximas citas">
          <span className="font-semibold text-foreground">{series.upcomingCount}</span>
          <span className="ml-1 text-xs text-secondary">
            (materializadas hasta{" "}
            {series.lastMaterializedOn ?? "—"} · horizonte {series.horizonWeeks} sem)
          </span>
        </Row>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={refreshing}
            onClick={onRefresh}
            title="Materializar más semanas"
          >
            <RefreshCw className="mr-1 h-3.5 w-3.5" /> Refrescar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Cancelar serie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <span className="w-24 text-xs uppercase tracking-[0.14em] text-secondary">
        {label}
      </span>
      <span className="flex-1 text-foreground">{children}</span>
    </div>
  );
}

function CreateDialog({
  barbers,
  services,
  onClose,
  onSubmit,
  submitting,
}: {
  barbers: { id: string; name: string }[];
  services: { id: string; name: string; duration: number }[];
  onClose: () => void;
  onSubmit: (input: CreateRecurringBookingInput) => void;
  submitting: boolean;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [barberId, setBarberId] = useState(barbers[0]?.id ?? "");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [dayOfWeek, setDayOfWeek] = useState(1); // Monday
  const [time, setTime] = useState("14:30");
  const [startsOn, setStartsOn] = useState(() => shiftDays(todayISO(), 1));
  const [endsOn, setEndsOn] = useState("");
  const [horizonWeeks, setHorizonWeeks] = useState(4);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const [hh, mm] = time.split(":").map(Number);
    if (hh === undefined || mm === undefined || Number.isNaN(hh) || Number.isNaN(mm)) {
      setError("Hora inválida");
      return;
    }
    if (customerPhone.replace(/\D/g, "").length < 10) {
      setError("Teléfono debe tener al menos 10 dígitos");
      return;
    }
    onSubmit({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      barberId,
      serviceId,
      dayOfWeek,
      timeMinutes: hh * 60 + mm,
      startsOn,
      ...(endsOn ? { endsOn } : {}),
      horizonWeeks,
    });
  }

  return (
    <ModalShell title="Nueva reserva recurrente" onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Cliente">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Nombre del cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <Input
              type="tel"
              inputMode="tel"
              placeholder="+573001234567"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
        </Field>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Barbero">
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white/82 px-3 text-sm"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Servicio">
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-white/82 px-3 text-sm"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Día de la semana">
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-border bg-white/82 px-3 text-sm"
            >
              {DAY_LABELS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Hora (local)">
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Field>
          <Field label="Horizonte (semanas)">
            <Input
              type="number"
              min={1}
              max={52}
              value={horizonWeeks}
              onChange={(e) => setHorizonWeeks(Number(e.target.value) || 4)}
            />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Primera cita (debe coincidir con el día)">
            <Input
              type="date"
              value={startsOn}
              onChange={(e) => setStartsOn(e.target.value)}
              required
            />
          </Field>
          <Field label="Última cita (opcional)">
            <Input
              type="date"
              value={endsOn}
              onChange={(e) => setEndsOn(e.target.value)}
            />
          </Field>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creando…" : "Crear serie"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function CancelDialog({
  series,
  onClose,
  onConfirm,
  submitting,
}: {
  series: RecurringBooking;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <ModalShell title="Cancelar serie" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-foreground">
              ¿Cancelar la serie de {series.customerName ?? series.customerPhone}?
            </p>
            <p className="mt-1 text-secondary">
              Las <strong>{series.upcomingCount} próximas citas</strong> BOOKED
              se cancelarán. Las citas pasadas (COMPLETED / NO_SHOW / CANCELLED)
              se conservan para mantener el historial.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Mantener
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting ? "Cancelando…" : "Sí, cancelar serie"}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-secondary">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // Lightweight local input so we don't pull the global one in just for this page.
  const { className, ...rest } = props;
  return (
    <input
      className={`h-10 w-full rounded-xl border border-border bg-white/82 px-3 text-sm focus:border-primary focus:outline-none ${className ?? ""}`}
      {...rest}
    />
  );
}

function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-2xl border-white/70 bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-secondary hover:bg-muted"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}

// Re-export the day-short array so tests / future components can use it.
export { DAY_SHORT };
