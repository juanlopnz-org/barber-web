"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarberAppointments } from "@/modules/shared/hooks/use-barber-appointments";
import { useServices } from "@/modules/shared/hooks/use-services";

export default function BarberAppointmentsPage() {
  const { data: appointments = [], isLoading } = useBarberAppointments();
  const { data: services = [] } = useServices();

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Citas</h1>
        <p className="mt-2 text-secondary">Listado de todas tus citas asignadas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-secondary">Cargando…</p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-secondary">No tienes citas asignadas.</p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-white/70 p-4"
              >
                <p className="font-semibold text-foreground">{serviceName(a.serviceId)}</p>
                <p className="text-sm text-secondary">
                  {new Date(a.startTime).toLocaleString("es-CO")}
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
