"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock3, Scissors, ShieldCheck, Star, Users } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useServices } from "@/modules/shared/hooks/use-services";
import { guestNavigation } from "@/modules/shared/config/navigation";

const benefits = [
  {
    icon: Calendar,
    title: "Reserva sin fricción",
    description: "Agenda en pocos pasos con una experiencia visual clara y confiable.",
  },
  {
    icon: ShieldCheck,
    title: "Operación ordenada",
    description: "La barbería mantiene agenda, servicios y disponibilidad bajo control.",
  },
  {
    icon: Clock3,
    title: "Disponibilidad transparente",
    description: "Horarios visibles, mensajes claros y una interfaz lista para escalar.",
  },
];

export default function LandingPage() {
  const { data: barbers = [] } = useBarbers();
  const { data: services = [] } = useServices();

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(127,168,212,0.18),transparent_70%)]" />

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <BrandLogo size={48} priority />
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/guest/booking">Reservar</Link>
          </Button>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl gap-10 px-6 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-secondary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-steel shadow-[0_0_10px_rgba(127,168,212,0.9)]" />
            Experiencia serena, moderna y enfocada en reservas
          </div>
          <h1 className="chrome-text mt-8 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] md:text-7xl">
            Una barbería digital con calma visual y operación profesional.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary md:text-xl">
            Barber System unifica experiencia pública, reservas de invitados y operación interna en una UI limpia, oscura y premium.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/guest/booking">
                Reservar como invitado
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Entrar al sistema</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <Card key={benefit.title} className="border-white/10 bg-white/[0.03]">
                  <CardContent className="p-5">
                    <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-chrome-soft p-3 text-steel">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-secondary">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex items-center">
          <Card className="w-full overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <CardHeader className="border-b border-white/10 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-secondary">Vista pública</p>
                  <CardTitle className="mt-2 text-2xl">Reserva inspirada en mañanas frías y orden digital</CardTitle>
                </div>
                <div className="rounded-full border border-steel/30 bg-steel-soft px-3 py-1 text-xs font-semibold text-steel">
                  Guest ready
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-3">
                {guestNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.href} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="rounded-2xl border border-white/10 bg-chrome-soft p-3 text-steel shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.label}</p>
                        <p className="text-sm text-secondary">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Users className="h-4 w-4" />
                    Barberos destacados
                  </div>
                  <div className="space-y-3">
                    {barbers.slice(0, 2).map((barber) => (
                      <div key={barber.id} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{barber.name}</p>
                          <p className="text-sm text-secondary">{barber.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          <Star className="h-4 w-4 fill-current text-steel" />
                          {barber.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Scissors className="h-4 w-4" />
                    Servicios frecuentes
                  </div>
                  <div className="space-y-3">
                    {services.slice(0, 2).map((service) => (
                      <div key={service.id} className="rounded-2xl bg-white/[0.04] px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{service.name}</p>
                          <span className="text-sm font-semibold text-foreground">
                            ${service.price.toLocaleString("es-CO")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-secondary">{service.duration} minutos</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
