import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  agendaBarberIds,
  agendaSlots,
  type AgendaSlot,
} from "@/modules/barber/data/agenda";
import { guestBarbers, guestServices } from "@/modules/guest/data/mock";
import { customerDirectory } from "@/modules/barber/data/appointments";
import type { AppointmentStatus } from "@/modules/shared/types";

const STATUS_BORDER: Record<AppointmentStatus, string> = {
  BOOKED: "border-l-primary",
  OFFERED: "border-l-warning",
  SWAP_PENDING: "border-l-warning",
  SWAP_MATCHED: "border-l-success",
  TRANSFERRED: "border-l-secondary",
  COMPLETED: "border-l-success/60",
  NO_SHOW: "border-l-destructive",
  CANCELLED: "border-l-destructive/50",
};

const STATUS_BG: Record<AppointmentStatus, string> = {
  BOOKED: "bg-primary/10",
  OFFERED: "bg-warning/10",
  SWAP_PENDING: "bg-warning/15",
  SWAP_MATCHED: "bg-success/15",
  TRANSFERRED: "bg-secondary/15",
  COMPLETED: "bg-success/10",
  NO_SHOW: "bg-destructive/15",
  CANCELLED: "bg-destructive/10",
};

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

function barberName(barberId: string) {
  return guestBarbers.find((barber) => barber.id === barberId)?.name ?? barberId;
}

function serviceName(serviceId: string) {
  return guestServices.find((service) => service.id === serviceId)?.name ?? "Servicio";
}

function customerName(customerId?: string | null) {
  if (!customerId) return "Cliente";
  return customerDirectory[customerId] ?? `Cliente ${customerId}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function buildTimeline(filteredBarbers: readonly string[]) {
  const map = new Map<string, Map<string, AgendaSlot>>();
  for (const slot of agendaSlots) {
    if (!filteredBarbers.includes(slot.barberId)) continue;
    const timeKey = formatTime(slot.startTime);
    if (!map.has(timeKey)) map.set(timeKey, new Map());
    map.get(timeKey)!.set(slot.barberId, slot);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

interface PageProps {
  searchParams: Promise<{ barber?: string }>;
}

export default async function AdminAgendaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedBarber = params.barber;
  const filteredBarbers =
    selectedBarber && selectedBarber !== "all" && agendaBarberIds.includes(selectedBarber as never)
      ? [selectedBarber]
      : [...agendaBarberIds];

  const timeline = buildTimeline(filteredBarbers);
  const visibleSlots = agendaSlots.filter((slot) => filteredBarbers.includes(slot.barberId));
  const totalSlots = timeline.length * filteredBarbers.length;
  const occupied = visibleSlots.filter((slot) => slot.appointment).length;
  const occupancyPercent = totalSlots === 0 ? 0 : Math.round((occupied / totalSlots) * 100);
  const freeSlots = totalSlots - occupied;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <FilterChip href="/admin/agenda" label="Todos" active={!selectedBarber || selectedBarber === "all"} />
        {guestBarbers
          .filter((barber) => agendaBarberIds.includes(barber.id as never))
          .map((barber) => (
            <FilterChip
              key={barber.id}
              href={`/admin/agenda?barber=${barber.id}`}
              label={barber.name.split(" ")[0]}
              active={selectedBarber === barber.id}
            />
          ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="Ocupación" value={`${occupancyPercent}%`} hint={`${occupied} / ${totalSlots} slots`} />
        <SummaryCard label="Slots libres" value={String(freeSlots)} hint="Disponibles para asignar" />
        <SummaryCard label="Vista activa" value={filteredBarbers.length === 1 ? barberName(filteredBarbers[0]) : "Todos"} hint={`${timeline.length} bloques de 30 min`} />
      </div>

      <Card className="overflow-hidden border-white/70 bg-white/88">
        <CardHeader className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Grilla del día</CardTitle>
          <div className="flex flex-wrap gap-2 text-[11px] text-secondary">
            <LegendDot color="bg-primary" label="Confirmada" />
            <LegendDot color="bg-warning" label="Swap / ofrecida" />
            <LegendDot color="bg-success" label="Completada" />
            <LegendDot color="bg-destructive" label="Cancelada" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div
                className="grid border-b border-border bg-muted/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary"
                style={{ gridTemplateColumns: `80px repeat(${filteredBarbers.length}, minmax(0, 1fr))` }}
              >
                <span>Hora</span>
                {filteredBarbers.map((barberId) => (
                  <span key={barberId}>{barberName(barberId)}</span>
                ))}
              </div>
              {timeline.map(([time, row]) => (
                <div
                  key={time}
                  className="grid items-stretch border-b border-border px-3 py-2 text-sm"
                  style={{ gridTemplateColumns: `80px repeat(${filteredBarbers.length}, minmax(0, 1fr))` }}
                >
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Clock3 className="h-3.5 w-3.5 text-secondary" />
                    {time}
                  </div>
                  {filteredBarbers.map((barberId) => {
                    const slot = row.get(barberId);
                    if (!slot || !slot.appointment) {
                      return (
                        <div
                          key={barberId}
                          className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-[11px] text-secondary"
                        >
                          {slot ? "Libre" : "—"}
                        </div>
                      );
                    }
                    const apt = slot.appointment;
                    return (
                      <div
                        key={barberId}
                        className={`rounded-xl border-l-4 ${STATUS_BORDER[apt.status]} ${STATUS_BG[apt.status]} px-3 py-2`}
                      >
                        <p className="text-xs font-semibold text-foreground">{serviceName(apt.serviceId)}</p>
                        <p className="text-[11px] text-secondary">{customerName(apt.customerId)}</p>
                        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-secondary">
                          {STATUS_LABELS[apt.status]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft"
          : "rounded-full border border-border bg-white/82 px-3 py-1.5 text-xs font-medium text-secondary"
      }
    >
      {label}
    </Link>
  );
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="border-white/70 bg-white/88">
      <CardContent className="p-4">
        <p className="text-xs text-secondary">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-secondary">{hint}</p>
      </CardContent>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/82 px-2.5 py-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}