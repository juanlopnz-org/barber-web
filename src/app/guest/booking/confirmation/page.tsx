import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function GuestBookingConfirmationPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
      <Card className="w-full border-white/10 bg-white/[0.04]">
        <CardContent className="flex flex-col items-center px-8 py-12 text-center">
          <div className="mb-4">
            <BrandLogo size={92} withWordmark={false} />
          </div>
          <div className="rounded-full border border-white/10 bg-chrome-soft p-4 text-foreground">
            <CheckCircle2 className="h-10 w-10 text-steel" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-secondary">Reserva creada</p>
          <h1 className="mt-3 text-4xl font-semibold text-foreground">Tu solicitud quedó registrada</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-secondary">
            Esta confirmación cierra la primera versión del flujo `GUEST` y deja una base visual coherente para conectar validaciones y persistencia real.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/guest/booking">Reservar otra cita</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
