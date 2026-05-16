import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Star, Clock } from "lucide-react"
import Link from "next/link"

const MOCK_BARBERS = [
  { id: 1, name: "Carlos Style", specialty: "Fade & Barba", rating: 4.9 },
  { id: 2, name: "Miguel Cuts", specialty: "Tijera Clásica", rating: 4.8 },
  { id: 3, name: "David Pro", specialty: "Diseños & Color", rating: 4.7 },
]

export default function BarbersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Nuestros Barberos</h1>
        <p className="text-muted-foreground mt-2">Encuentra a tu profesional ideal y reserva tu turno.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_BARBERS.map((barber) => (
          <Card key={barber.id} className="overflow-hidden">
            <div className="aspect-square bg-secondary relative">
              {/* Imagen del barbero mock */}
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Foto {barber.name}
              </div>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{barber.name}</h3>
                  <p className="text-sm text-muted-foreground">{barber.specialty}</p>
                </div>
                <div className="flex items-center text-primary">
                  <Star className="h-4 w-4 fill-primary mr-1" />
                  <span className="font-medium text-sm">{barber.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Horarios disponibles mock */}
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">10:00 AM</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">11:30 AM</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">04:00 PM</span>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/book?barber=${barber.id}`}>Reservar</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
