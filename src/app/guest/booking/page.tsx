import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { guestBarbers, guestServices } from "@/modules/guest/data/mock";

export default function GuestBookingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">Guest Booking</p>
        <h1 className="mt-3 text-4xl font-semibold text-foreground">Reserva como invitado</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-secondary">
          Esta es la primera versión del flujo público. Queda lista para conectar disponibilidad real con React Query en la siguiente iteración.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle>Datos de la reserva</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <Input placeholder="Tu nombre completo" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Teléfono</label>
                <Input placeholder="+57 300 000 0000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Servicio</label>
              <select className="flex h-12 w-full rounded-2xl border border-border bg-white/80 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring">
                {guestServices.map((service) => (
                  <option key={service.id}>{service.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Barbero</label>
              <select className="flex h-12 w-full rounded-2xl border border-border bg-white/80 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring">
                {guestBarbers.map((barber) => (
                  <option key={barber.id}>{barber.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Fecha</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Hora</label>
                <Input type="time" />
              </div>
            </div>
            <Button size="lg" asChild>
              <Link href="/guest/booking/confirmation">Confirmar reserva</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-[#384959] text-white">
          <CardHeader>
            <CardTitle className="text-white">Resumen visual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Servicio sugerido</p>
              <p className="mt-2 text-xl font-semibold">Experiencia completa</p>
              <p className="mt-1 text-sm text-white/72">75 minutos · $98.000</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Disponibilidad destacada</p>
              <p className="mt-2 text-xl font-semibold">Mañana · 10:30 AM</p>
              <p className="mt-1 text-sm text-white/72">Con Mateo Rios</p>
            </div>
            <div className="rounded-2xl bg-primary/18 p-4 text-sm leading-6 text-white/86">
              La siguiente fase conectará este panel a disponibilidad real, validaciones de negocio y confirmación backend.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
