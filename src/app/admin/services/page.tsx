import { Clock3, DollarSign, Plus, MoreHorizontal, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { guestServices } from "@/modules/guest/data/mock";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

const PRICING_TIERS = [
  { name: "Corte premium", recommended: 65000 },
  { name: "Barba y perfilado", recommended: 40000 },
  { name: "Experiencia completa", recommended: 98000 },
];

export default function AdminServicesPage() {
  const active = guestServices.filter((service) => service.active).length;
  const averagePrice = Math.round(
    guestServices.reduce((sum, service) => sum + service.price, 0) / guestServices.length
  );
  const averageDuration = Math.round(
    guestServices.reduce((sum, service) => sum + service.duration, 0) / guestServices.length
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Catálogo</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Servicios
          </h1>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo servicio
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard label="Activos" value={`${active} / ${guestServices.length}`} hint="Disponibles para reservar" />
        <SummaryCard label="Precio promedio" value={formatCurrency(averagePrice)} hint="Ticket medio del catálogo" />
        <SummaryCard label="Duración promedio" value={`${averageDuration} min`} hint="Bloques de 30 minutos" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Servicios publicados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guestServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-white/82 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{service.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        service.active
                          ? "bg-success/15 text-success"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {service.active ? "Activo" : "Pausado"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {service.duration} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost">
                    Pausar
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Más opciones">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[#384959] text-white">
          <CardHeader>
            <CardTitle className="text-white">Sugerencias de pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PRICING_TIERS.map((tier) => (
              <div key={tier.name} className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{tier.name}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    <TrendingUp className="h-3 w-3" />
                    Sugerido
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(tier.recommended)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
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