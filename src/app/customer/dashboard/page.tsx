import { Calendar, Clock3, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const appointmentStats = [
  { label: "Próxima cita", value: "Mañana 15:30", hint: "Carlos Mendez" },
  { label: "Servicios favoritos", value: "3", hint: "Corte premium, barba, styling" },
  { label: "Tiempo promedio", value: "45 min", hint: "Duración más reservada" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <Card className="overflow-hidden border-white/70 bg-white/88">
          <CardContent className="grid gap-6 p-7 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-secondary">Cliente</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
                Hola, Juan Carlos
              </h1>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button>Reservar de nuevo</Button>
                <Button variant="outline">Ver historial</Button>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-[#384959] p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/70">Próxima visita</p>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Corte clásico + barba</h2>
              <div className="mt-5 space-y-3 text-sm text-white/76">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-primary" />
                  Mañana, 15:30 - 16:15
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Con Carlos Mendez
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Indicadores rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointmentStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-muted px-4 py-4">
                <p className="text-sm text-secondary">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-secondary">{stat.hint}</p>
              </div>
            ))}
          </CardContent>
        </Card> */}
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button className="justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Nueva reserva
            </Button>
            <Button className="justify-start" variant="outline">
              Reprogramar cita
            </Button>
            <Button className="justify-start" variant="outline">
              Explorar barberos
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Resumen semanal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Martes", "Corte premium", "15:30"],
              ["Jueves", "Barba y perfilado", "18:00"],
              ["Sábado", "Disponibilidad libre", "3 slots"],
            ].map(([day, service, time]) => (
              <div key={day} className="flex items-center justify-between rounded-2xl border border-border bg-white/78 px-4 py-4">
                <div>
                  <p className="font-medium text-foreground">{day}</p>
                  <p className="text-sm text-secondary">{service}</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-foreground">
                  {time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
