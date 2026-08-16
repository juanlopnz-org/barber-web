"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useServices } from "@/modules/shared/hooks/use-services";
import { useCreateAppointment } from "@/modules/shared/hooks/use-create-appointment";
import { useSessionStore } from "@/store/session-store";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";

export interface BookingFormDefaults {
  name?: string;
  email?: string;
  phone?: string;
  preferredBarberId?: string;
}

interface BookingFormProps {
  defaults?: BookingFormDefaults;
  submitLabel?: string;
  confirmationHref?: string;
  title?: string;
}

const selectClasses =
  "flex h-12 w-full rounded-2xl border border-border bg-white/80 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring";

export function BookingForm({
  defaults = {},
  submitLabel = "Reservar",
  confirmationHref = "/guest/booking/confirmation",
  title = "Datos de la reserva",
}: BookingFormProps) {
  const router = useRouter();
  const { data: barbers = [], isLoading: loadingBarbers } = useBarbers();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const createAppointment = useCreateAppointment();
  const user = useSessionStore((state) => state.user);
  const { getErrorMessage } = useAuthSession();

  const [name, setName] = useState(defaults.name ?? (user.authenticated ? user.name ?? "" : ""));
  const [phone, setPhone] = useState(defaults.phone ?? "");
  const [email, setEmail] = useState(defaults.email ?? (user.authenticated ? user.email ?? "" : ""));
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [barberId, setBarberId] = useState(
    defaults.preferredBarberId ?? barbers[0]?.id ?? ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isPrefilled = Boolean(defaults.name || defaults.email || defaults.phone);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    if (!serviceId || !barberId || !date || !time) {
      setErrorMessage("Selecciona servicio, barbero, fecha y hora.");
      return;
    }

    const startTime = new Date(`${date}T${time}:00.000Z`).toISOString();

    try {
      await createAppointment.mutateAsync({
        barberId,
        serviceId,
        startTime,
        customerId: user.authenticated ? user.id : undefined,
        guestName: user.authenticated ? undefined : name,
        guestPhone: user.authenticated ? undefined : phone,
      });
      router.push(confirmationHref);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  }

  const isLoading = loadingBarbers || loadingServices || createAppointment.isPending;

  return (
    <Card className="border-white/70 bg-white/88">
      <CardHeader className="space-y-2">
        <CardTitle>{title}</CardTitle>
        {isPrefilled ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-foreground">
            <UserRound className="h-3.5 w-3.5" />
            Datos de tu cuenta cargados
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nombre</label>
              <Input
                placeholder="Tu nombre completo"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={user.authenticated}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <Input
                placeholder="+57 300 000 0000"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Correo</label>
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={user.authenticated}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Servicio</label>
            <select
              className={selectClasses}
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} · ${service.price.toLocaleString("es-CO")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Barbero</label>
            <select
              className={selectClasses}
              value={barberId}
              onChange={(event) => setBarberId(event.target.value)}
            >
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Fecha</label>
              <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hora</label>
              <Input type="time" value={time} onChange={(event) => setTime(event.target.value)} />
            </div>
          </div>
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          <Button size="lg" type="submit" disabled={isLoading}>
            {isLoading ? "Reservando…" : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
