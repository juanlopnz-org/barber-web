import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Users,
  UserX,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  adminMetrics,
  upcomingAppointments,
  barberPerformance,
} from "@/modules/admin/data/metrics";
import { guestBarbers, guestServices } from "@/modules/guest/data/mock";
import { customerDirectory } from "@/modules/barber/data/appointments";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

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

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

const KPI_CARDS = [
  {
    label: "Citas hoy",
    value: String(adminMetrics.appointmentsToday),
    hint: "Programadas para 11 de julio",
    icon: CalendarDays,
  },
  {
    label: "Ocupación",
    value: `${adminMetrics.occupancyPercent}%`,
    hint: "Slots reservados del día",
    icon: TrendingUp,
  },
  {
    label: "Barberos activos",
    value: String(adminMetrics.activeBarbers),
    hint: "De 4 en el equipo",
    icon: Users,
  },
  {
    label: "Ingresos semanales",
    value: formatCurrency(adminMetrics.weeklyRevenue),
    hint: "+12% vs semana anterior",
    icon: DollarSign,
  },
];

export default function AdminDashboardPage() {
  const topBarbers = [...barberPerformance]
    .sort((a, b) => b.completedAppointments - a.completedAppointments)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="border-white/70 bg-white/88">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-2xl bg-accent p-3 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-4 text-sm text-secondary">{kpi.label}</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{kpi.value}</p>
                <p className="mt-1 text-sm text-secondary">{kpi.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximas citas</CardTitle>
            <span className="text-xs font-medium text-secondary">
              {upcomingAppointments.length} reservas
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-white/82 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-accent px-3 py-2 text-sm font-semibold text-foreground">
                    {formatTime(apt.startTime)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {customerName(apt.customerId)}
                    </p>
                    <p className="text-sm text-secondary">
                      {serviceName(apt.serviceId)} · {barberName(apt.barberId)}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    apt.status === "CANCELLED"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/15 text-foreground"
                  }`}
                >
                  {apt.status === "CANCELLED" ? "Cancelada" : "Confirmada"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[#384959] text-white">
          <CardHeader>
            <CardTitle className="text-white">Resumen mensual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm text-white/70">Ingresos del mes</p>
              <p className="mt-1 text-3xl font-semibold">
                {formatCurrency(adminMetrics.monthlyRevenue)}
              </p>
              <p className="mt-1 text-sm text-white/70">Proyección cierre de mes</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Tasa de cancelación</p>
              <p className="mt-1 text-2xl font-semibold">{adminMetrics.cancellationRate}%</p>
              <p className="mt-1 text-sm text-white/70">
                Por debajo del objetivo del 8%
              </p>
            </div>
            <div className="rounded-2xl bg-primary/18 p-4 text-sm leading-6 text-white/86">
              Configura objetivos mensuales en la sección de Servicios para hacer seguimiento
              automático del equipo.
            </div>
            <Button className="w-full bg-white text-foreground hover:bg-white/92">
              Ver reporte completo
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Top barberos</CardTitle>
            <p className="mt-2 text-sm text-secondary">
              Ordenado por citas completadas en los últimos 30 días.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {topBarbers.map((barber, index) => (
              <div
                key={barber.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-white/82 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-base font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{barber.name}</p>
                    <p className="text-sm text-secondary">{barber.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {barber.completedAppointments}
                  </p>
                  <p className="text-xs text-secondary">citas completadas</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Alertas operativas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
              <UserX className="mt-0.5 h-5 w-5 text-warning" />
              <div>
                <p className="font-semibold text-foreground">Andrés Castaño inactivo</p>
                <p className="mt-1 text-sm text-secondary">
                  Sin atender clientes desde hace 12 días. Revisar disponibilidad o reasignar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white/82 p-4">
              <TrendingUp className="mt-0.5 h-5 w-5 text-success" />
              <div>
                <p className="font-semibold text-foreground">Pico de demanda el sábado</p>
                <p className="mt-1 text-sm text-secondary">
                  Ocupación proyectada del 92% entre 10:00 y 13:00.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-white/82 p-4">
              <DollarSign className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Servicio estrella del mes</p>
                <p className="mt-1 text-sm text-secondary">
                  &ldquo;Experiencia completa&rdquo; representa el 48% de los ingresos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}