"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, Clock } from "lucide-react";
import Link from "next/link";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";

const MOCK_TIME_SLOTS = ["10:00 AM", "11:30 AM", "04:00 PM"];

export default function BarbersPage() {
  const { data: barbers = [], isLoading } = useBarbers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Nuestros Barberos</h1>
        <p className="mt-2 text-secondary">Encuentra a tu profesional ideal y reserva tu turno.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-secondary">Cargando barberos…</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id} className="overflow-hidden">
              <div className="aspect-square bg-secondary relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/70">
                  Foto {barber.name}
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{barber.name}</h3>
                    <p className="text-sm text-secondary">{barber.specialty}</p>
                  </div>
                  <div className="flex items-center text-primary">
                    <Star className="h-4 w-4 fill-primary mr-1" />
                    <span className="font-medium text-sm">{barber.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOCK_TIME_SLOTS.map((slot) => (
                    <span key={slot} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {slot}
                    </span>
                  ))}
                </div>
                <Button className="w-full" asChild>
                  <Link href={`/customer/book?barber=${barber.id}`}>Reservar</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
