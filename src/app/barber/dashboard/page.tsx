"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarberAppointments } from "@/modules/shared/hooks/use-barber-appointments";
import { useServices } from "@/modules/shared/hooks/use-services";

export default function BarberDashboardPage() {
  const { data: appointments = [], isLoading } = useBarberAppointments();
  const { data: services = [] } = useServices();

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";

  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter(
    (a) => a.startTime.slice(0, 10) === today,
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
                className="rounded-2xl border border-border bg-white/70 p-4"
              >
                <p className="font-semibold text-foreground">{serviceName(a.serviceId)}</p>
                <p className="text-sm text-secondary">
                  {new Date(a.startTime).toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-secondary">
                  {a.status}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
