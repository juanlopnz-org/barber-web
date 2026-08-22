"use client";

import Link from "next/link";
import { Star, UserPlus, CalendarDays, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";

function formatJoinedDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBarbersPage() {
  const { data: barbers = [], isLoading } = useBarbers();
  const activeCount = barbers.filter((b) => b.active).length;
  const inactiveCount = barbers.length - activeCount;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Equipo</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Barberos
          </h1>
        </div>
        <Button size="lg" disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo barbero
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Equipo total</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {barbers.length}
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
            Gestiona el equipo y configura la disponibilidad de cada barbero.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : barbers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white/60 p-4 text-sm text-muted-foreground">
              Aún no hay barberos registrados.
            </p>
          ) : (
            barbers.map((barber) => (
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
                    <p className="text-sm text-secondary">{barber.specialty ?? "—"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current text-primary" />
                        {barber.rating} · calificación
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/barbers/${barber.id}/schedule`}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Ver horarios
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}