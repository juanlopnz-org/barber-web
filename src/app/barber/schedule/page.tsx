import { CalendarDays, Clock3, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { todaySchedule, formatDuration } from "@/modules/barber/data/schedule";

export default function BarberSchedulePage() {
  const totalMinutes =
    todaySchedule.blocks.reduce((sum, block) => {
      const [sh, sm] = block.startTime.split(":").map(Number);
      const [eh, em] = block.endTime.split(":").map(Number);
      return sum + (eh * 60 + em - (sh * 60 + sm));
    }, 0);

  const availableMinutes = (() => {
    const [sh, sm] = todaySchedule.startTime.split(":").map(Number);
    const [eh, em] = todaySchedule.endTime.split(":").map(Number);
    return eh * 60 + em - (sh * 60 + sm);
  })();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/70 bg-white/88">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" />
              Jornada de hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Hora de entrada</label>
                <Input type="time" defaultValue={todaySchedule.startTime} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Hora de salida</label>
                <Input type="time" defaultValue={todaySchedule.endTime} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Disponible para reservas</p>
                <p className="text-xs text-secondary">
                  Apagas para bloquear todas las citas del día
                </p>
              </div>
              <span
                className={`inline-flex h-7 w-12 items-center rounded-full px-1 transition-colors ${
                  todaySchedule.isAvailable ? "bg-success/30" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    todaySchedule.isAvailable ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white/82 p-3">
                <p className="text-xs text-secondary">Jornada total</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatDuration(todaySchedule.startTime, todaySchedule.endTime)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white/82 p-3">
                <p className="text-xs text-secondary">Bloqueado</p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatDuration("00:00", String(totalMinutes).padStart(2, "0"))}
                </p>
              </div>
            </div>
            <Button className="w-full">Guardar jornada</Button>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/88">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Bloqueos de hoy
            </CardTitle>
            <span className="text-xs font-medium text-secondary">
              {todaySchedule.blocks.length} activos
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySchedule.blocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-white/82 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-foreground">
                      {block.startTime}
                    </p>
                    <p className="text-[10px] text-secondary">↓ {block.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{block.label}</p>
                    <p className="text-xs text-secondary">
                      {formatDuration(block.startTime, block.endTime)}
                    </p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" aria-label={`Quitar ${block.label}`}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar bloqueo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/70 bg-white/82">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">Resumen</p>
            <p className="mt-1 text-sm text-secondary">
              Disponibilidad real: {formatDuration("00:00", String(availableMinutes - totalMinutes).padStart(2, "0"))} de {formatDuration("00:00", String(availableMinutes).padStart(2, "0"))} en tu jornada.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Vista semanal</Button>
            <Button>Publicar cambios</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}