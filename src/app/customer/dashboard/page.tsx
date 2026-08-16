"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useMyAppointments } from "@/modules/shared/hooks/use-my-appointments";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useServices } from "@/modules/shared/hooks/use-services";

export default function CustomerDashboardPage() {
  const { data: appointments = [], isLoading } = useMyAppointments();
  const { data: barbers = [] } = useBarbers();
  const { data: services = [] } = useServices();

  const barberName = (id: string) => barbers.find((b) => b.id === id)?.name ?? "—";
  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi panel</h1>
        <p className="mt-2 text-secondary">Revisa tus próximas reservas y tu historial.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas citas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-secondary">Cargando tus citas…</p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-secondary">No tienes citas próximas.</p>
          ) : (
            appointments.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-white/70 p-4"
              >
                <p className="font-semibold text-foreground">{serviceName(a.serviceId)}</p>
                <p className="text-sm text-secondary">
                  {barberName(a.barberId)} · {new Date(a.startTime).toLocaleString("es-CO")}
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
