"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarberAppointments } from "@/modules/shared/hooks/use-barber-appointments";
import { useServices } from "@/modules/shared/hooks/use-services";
import { AppointmentActions } from "@/modules/shared/components/AppointmentActions";
import {
  APPOINTMENT_STATUS_BADGE,
  appointmentStatusLabel,
} from "@/modules/shared/lib/appointment-status";
import {
  shiftISODate,
  todayLocalISODate,
  toLocalISODate,
} from "@/modules/shared/lib/local-date";

export default function BarberDashboardPage() {
  // The API's `from`/`to` bounds are UTC, while the barber thinks in local
  // calendar days (America/Bogota, UTC-5). We ask for a window that is one
  // day wider on each side and then filter by the local date, so the
  // evening appointments (which are stored as the next UTC day) are not
  // dropped.
  const today = todayLocalISODate();
  const range = {
    from: shiftISODate(today, -1),
    to: shiftISODate(today, 2),
  };

  const { data, isLoading } = useBarberAppointments({
    ...range,
    pageSize: 100,
    order: "asc",
  });
  const { data: services = [] } = useServices();

  const serviceName = (id: string) =>
    services.find((s) => s.id === id)?.name ?? "—";
  const customerName = (guestName?: string | null, customerId?: string | null) =>
    guestName ?? (customerId ? `Cliente ${customerId.slice(0, 8)}` : "Cliente");

  const todayAppointments = (data?.items ?? []).filter(
    (a) => toLocalISODate(a.startTime) === today,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi agenda</h1>
        <p className="mt-2 text-secondary">Resumen de hoy y próximas citas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Citas de hoy ({todayAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-secondary">Cargando…</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-sm text-secondary">No hay citas para hoy.</p>
          ) : (
            todayAppointments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-white/[0.04] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">
                      {serviceName(a.serviceId)}
                    </p>
                    <p className="text-sm text-secondary">
                      {new Date(a.startTime).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {customerName(a.guestName, a.customerId)}
                    </p>
                  </div>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                      (APPOINTMENT_STATUS_BADGE[a.status] ??
                        "bg-muted text-secondary")
                    }
                  >
                    {appointmentStatusLabel(a.status)}
                  </span>
                </div>
                <AppointmentActions
                  appointment={a}
                  className="mt-3 flex flex-wrap gap-1"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
