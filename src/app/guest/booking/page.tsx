import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookingForm } from "@/modules/booking/components/BookingForm";

export default function GuestBookingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl flex-col px-4 py-6 lg:px-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">Guest Booking</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
          Reserva como invitado
        </h1>
      </div>

      <div className="grid flex-1 gap-5 lg:auto-rows-fr lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <BookingForm
          submitLabel="Reservar"
          confirmationHref="/guest/booking/confirmation"
          title="Datos de la reserva"
        />

        <div className="flex flex-col gap-5">
          <Card className="flex flex-1 flex-col border-white/70 bg-[#384959] text-white">
            <CardHeader>
              <CardTitle className="text-white">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/70">Servicio sugerido</p>
                <p className="mt-2 text-xl font-semibold">Experiencia completa</p>
                <p className="mt-1 text-sm text-white/72">$98.000</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm text-white/70">Disponibilidad destacada</p>
                <p className="mt-2 text-xl font-semibold">Mañana · 10:30 AM</p>
                <p className="mt-1 text-sm text-white/72">Con Mateo Rios</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/70 bg-white/82">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-xl bg-success/15 p-2 text-success">
                <Shield className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Reserva sin compromiso
                </p>
                <p className="text-xs text-secondary">
                  Podrás cancelar o reagendar hasta 2 horas antes sin costo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-4 text-xs text-secondary md:flex-row md:justify-between">
        <span>Barber System · Reserva directa sin registro</span>
        <span>Soporte 24/7 · WhatsApp +57 300 000 0000</span>
      </footer>
    </main>
  );
}

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}