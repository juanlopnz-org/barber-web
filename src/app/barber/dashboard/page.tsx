import { CalendarDays, DollarSign, Scissors, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const metrics = [
  { label: "Citas hoy", value: "8", icon: CalendarDays },
  { label: "Clientes nuevos", value: "3", icon: Users },
  { label: "Ingreso estimado", value: "$420.000", icon: DollarSign },
];

export default function BarberDashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-7">
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">Barbero</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
              Dashboard profesional
            </h1>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div key={metric.label} className="rounded-2xl bg-muted p-4">
                    <div className="mb-4 inline-flex rounded-2xl bg-white p-3 text-secondary shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-secondary">{metric.label}</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[#384959] text-white">
          <CardHeader>
            <CardTitle className="text-white">Siguiente servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">14:00</p>
              <h3 className="mt-2 text-xl font-semibold">Juan Pérez</h3>
              <p className="mt-1 text-sm text-white/72">Corte premium + perfilado</p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-white text-foreground hover:bg-white/92">Comenzar</Button>
              <Button variant="outline" className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                Reagendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Agenda del día</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["14:00", "Juan Pérez", "Corte premium"],
              ["15:00", "Luis Herrera", "Barba y perfilado"],
              ["16:30", "Daniel Rocha", "Experiencia completa"],
            ].map(([time, customer, service]) => (
              <div key={time} className="flex items-center gap-4 rounded-2xl border border-border bg-white/78 px-4 py-4">
                <div className="rounded-2xl bg-accent px-3 py-2 text-sm font-semibold text-foreground">
                  {time}
                </div>
                <div>
                  <p className="font-medium text-foreground">{customer}</p>
                  <p className="text-sm text-secondary">{service}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Acciones de operación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="justify-start" variant="outline">
              <Scissors className="mr-2 h-4 w-4" />
              Bloquear horario
            </Button>
            <Button className="justify-start" variant="outline">
              Ver agenda semanal
            </Button>
            <Button className="justify-start" variant="outline">
              Revisar solicitudes
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
