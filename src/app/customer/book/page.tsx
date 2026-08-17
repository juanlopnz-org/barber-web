"use client";

import { useSearchParams } from "next/navigation";
import { Sparkles, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BookingForm } from "@/modules/booking/components/BookingForm";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";

export default function CustomerBookPage() {
  const { user } = useAuthSession();
  const searchParams = useSearchParams();
  const preferredBarberId = searchParams.get("barber") ?? undefined;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-white/70 bg-white/88">
        <CardContent className="grid gap-5 p-5 md:grid-cols-[1.15fr_0.85fr] md:items-center md:p-7">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">Reserva con cuenta</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Hola, {user.name?.split(" ")[0] ?? "cliente"}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Sesión iniciada
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary">
                <Sparkles className="h-3.5 w-3.5" />
                Historial automático
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-[#384959] p-4 text-white shadow-2xl md:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/70">Tu última visita</p>
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-3 text-xl font-semibold md:text-2xl">Experiencia completa</h2>
            <div className="mt-3 space-y-2 text-sm text-white/76">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                28 jun · 10:00 - 10:30
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Con Carlos Mendez
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BookingForm
        defaults={{
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          preferredBarberId,
        }}
        submitLabel="Reservar"
        confirmationHref="/guest/booking/confirmation"
        title="Nueva reserva"
      />
    </div>
  );
}