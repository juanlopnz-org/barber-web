import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { guestBarbers } from "@/modules/guest/data/mock";

export default function GuestBarbersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-secondary">Guest</p>
        <h1 className="mt-3 text-4xl font-semibold text-foreground">Barberos disponibles</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-secondary">
          Primer recorrido público del planning: explorar especialistas sin autenticación y con una UI consistente.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {guestBarbers.map((barber) => (
          <Card key={barber.id} className="border-white/70 bg-white/88">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{barber.name}</CardTitle>
                <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 fill-current text-primary" />
                  {barber.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-secondary">{barber.specialty}</p>
              <Button className="mt-6 w-full" variant="outline">
                Ver disponibilidad
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
