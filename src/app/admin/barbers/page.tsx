import { Star, UserPlus, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { barberPerformance } from "@/modules/admin/data/metrics";

function formatCurrency(value: number) {
  return value === 0 ? "—" : `$${value.toLocaleString("es-CO")}`;
}

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBarbersPage() {
  const activeCount = barberPerformance.filter((b) => b.active).length;
  const inactiveCount = barberPerformance.length - activeCount;
  const totalEarnings = barberPerformance.reduce(
    (sum, barber) => sum + barber.weeklyEarnings,
    0
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Equipo</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Barberos
          </h1>
        </div>
        <Button size="lg">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo barbero
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Equipo total</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {barberPerformance.length}
            </p>
            <p className="mt-1 text-sm text-secondary">Profesionales registrados</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Activos</p>
            <p className="mt-2 text-3xl font-semibold text-success">{activeCount}</p>
            <p className="mt-1 text-sm text-secondary">Aceptando reservas</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Pausados</p>
            <p className="mt-2 text-3xl font-semibold text-warning">{inactiveCount}</p>
            <p className="mt-1 text-sm text-secondary">Necesitan revisión</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/70 bg-white/88">
        <CardHeader>
          <CardTitle>Roster del equipo</CardTitle>
          <p className="mt-2 text-sm text-secondary">
            Ganancias estimadas de la semana: {formatCurrency(totalEarnings)}.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {barberPerformance.map((barber) => (
            <div
              key={barber.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white/82 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-base font-semibold text-foreground">
                  {barber.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{barber.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        barber.active
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {barber.active ? "Activo" : "Pausado"}
                    </span>
                  </div>
                  <p className="text-sm text-secondary">{barber.specialty}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-current text-primary" />
                      {barber.rating} · calificación
                    </span>
                    <span>Desde {formatJoinedDate(barber.joinedAt)}</span>
                    <span>{barber.completedAppointments} citas acumuladas</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-secondary">Semana</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(barber.weeklyEarnings)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant={barber.active ? "ghost" : "default"}>
                    {barber.active ? "Pausar" : "Activar"}
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Más opciones">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}