import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Hola, Juan! 👋</h1>
        <p className="text-muted-foreground mt-2">Bienvenido de vuelta. Aquí tienes tu resumen.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Appointment Card */}
        <Card className="col-span-full lg:col-span-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              Próxima Cita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Corte Clásico + Barba</h3>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Mañana, 15:30 - 16:30</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Con Carlos (Barbero Senior)</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" className="flex-1 md:flex-none">Reprogramar</Button>
                <Button className="flex-1 md:flex-none">Detalles</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="secondary">
              <Calendar className="mr-2 h-4 w-4" /> Nueva Reserva
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Explorar Barberos
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Ver Muro de Swaps
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
