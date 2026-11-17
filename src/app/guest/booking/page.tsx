import { PublicHeader } from "@/components/brand/PublicHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookingForm } from "@/modules/booking/components/BookingForm";

export default function GuestBookingPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl flex-col px-4 pb-6 lg:px-8">
      <PublicHeader />
      <div className="mb-5 flex flex-col items-center gap-1 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">Guest Booking</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
          Reserva como invitado
        </h1>
      </div>

      <div className="flex flex-1 gap-5 lg:auto-rows-fr lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch justify-center">
        <BookingForm
          submitLabel="Reservar"
          confirmationHref="/guest/booking/confirmation"
          title="Datos de la reserva"
        />
      </div>

      <footer className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-4 text-xs text-secondary md:flex-row md:justify-between">
        <span>Barber System · Reserva directa sin registro</span>
        <span>Soporte 24/7 · WhatsApp +57 323 416 3580</span>
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