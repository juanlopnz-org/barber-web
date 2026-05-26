import { Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { guestServices } from "@/modules/guest/data/mock";

export default function GuestServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">Guest</p>
        <h1 className="mt-3 text-4xl font-semibold text-foreground">Servicios y precios</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-secondary">
          Catálogo público inicial para el módulo de invitado, con jerarquía visual clara y tonos suaves.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {guestServices.map((service) => (
          <Card key={service.id} className="border-white/70 bg-white/88">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Clock3 className="h-4 w-4" />
                {service.duration} minutos
              </div>
              <p className="mt-4 text-3xl font-semibold text-foreground">
                ${service.price.toLocaleString("es-CO")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
