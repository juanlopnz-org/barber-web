import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Calendar as CalendarIcon, Clock, Users, DollarSign } from "lucide-react"

export default function BarberDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Profesional</h1>
        <p className="text-muted-foreground mt-2">Resumen de tu agenda para hoy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$180.00</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próxima Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg border border-border">
                <div>
                  <h4 className="font-bold">Juan Pérez</h4>
                  <p className="text-sm text-muted-foreground">Corte Clásico</p>
                </div>
                <div className="text-right">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">14:00</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="w-full">Comenzar</Button>
                <Button variant="outline" className="w-full">Cancelar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda del Día</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[15, 16, 17].map((hour) => (
              <div key={hour} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="w-12 text-muted-foreground font-medium">{hour}:00</span>
                  <div className="h-10 w-1 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">Cliente Mock</p>
                    <p className="text-xs text-muted-foreground">Corte & Barba</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
