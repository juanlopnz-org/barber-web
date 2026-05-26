import Link from "next/link";
import { ArrowRight, Calendar, Clock3, Scissors, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { guestBarbers, guestServices } from "@/modules/guest/data/mock";
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
  return (
    <main className="relative overflow-hidden">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-14">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-secondary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Experiencia serena, moderna y enfocada en reservas
          </div>
          <h1 className="mt-8 max-w-3xl text-balance text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl">
            Una barbería digital con calma visual y operación profesional.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary md:text-xl">
            Barber System unifica experiencia pública, reservas de invitados y operación interna en una UI limpia, ligera y premium.
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
                <Card key={benefit.title} className="border-white/70 bg-white/78">
                  <CardContent className="p-5">
                    <div className="mb-4 inline-flex rounded-2xl bg-accent p-3 text-foreground">
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
          <Card className="w-full overflow-hidden border-white/70 bg-white/82">
            <CardHeader className="border-b border-border/70 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-secondary">Vista pública</p>
                  <CardTitle className="mt-2 text-2xl">Reserva inspirada en mañanas frías y orden digital</CardTitle>
                </div>
                <div className="rounded-full bg-primary/30 px-3 py-1 text-xs font-semibold text-foreground">
                  Guest ready
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-3">
                {guestNavigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.href} className="flex items-center gap-4 rounded-2xl border border-border bg-accent/40 p-4">
                      <div className="rounded-2xl bg-white p-3 text-secondary shadow-sm">
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
                <div className="rounded-2xl border border-border bg-white/80 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Users className="h-4 w-4" />
                    Barberos destacados
                  </div>
                  <div className="space-y-3">
                    {guestBarbers.slice(0, 2).map((barber) => (
                      <div key={barber.id} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{barber.name}</p>
                          <p className="text-sm text-secondary">{barber.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          <Star className="h-4 w-4 fill-current text-primary" />
                          {barber.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-white/80 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Scissors className="h-4 w-4" />
                    Servicios frecuentes
                  </div>
                  <div className="space-y-3">
                    {guestServices.slice(0, 2).map((service) => (
                      <div key={service.id} className="rounded-2xl bg-muted px-4 py-3">
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
