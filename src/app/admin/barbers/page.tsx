"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Star, UserPlus, CalendarDays, Loader2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  useBarbers,
  useDeleteBarber,
  useUpdateBarber,
} from "@/modules/shared/hooks/use-barbers";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import type { Barber } from "@/modules/shared/types";

const barberSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(120, "Máximo 120 caracteres"),
  specialty: z.string().max(120, "Máximo 120 caracteres"),
  rating: z
    .number()
    .min(0, "La calificación no puede ser menor que 0")
    .max(5, "La calificación no puede ser mayor que 5"),
  active: z.boolean(),
});

type BarberFormValues = z.infer<typeof barberSchema>;

function formatJoinedDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBarbersPage() {
  const { data: barbers = [], isLoading } = useBarbers();
  const { getErrorMessage } = useAuthSession();
  const updateBarber = useUpdateBarber();
  const deleteBarber = useDeleteBarber();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [editing, setEditing] = useState<Barber | null>(null);
  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberSchema),
    defaultValues: { name: "", specialty: "", rating: 0, active: true },
  });
  const activeCount = barbers.filter((b) => b.active).length;
  const inactiveCount = barbers.length - activeCount;

  function openEdit(barber: Barber) {
    setEditing(barber);
    form.reset({
      name: barber.name,
      specialty: barber.specialty ?? "",
      rating: barber.rating,
      active: barber.active,
    });
    dialogRef.current?.showModal();
  }

  async function onSubmit(values: BarberFormValues) {
    if (!editing) return;
    try {
      await updateBarber.mutateAsync({
        id: editing.id,
        input: {
          name: values.name,
          specialty: values.specialty || null,
          rating: values.rating,
          active: values.active,
        },
      });
      dialogRef.current?.close();
    } catch (err) {
      form.setError("root", { message: getErrorMessage(err) });
    }
  }

  async function onDelete(barber: Barber) {
    if (
      !window.confirm(
        `¿Eliminar a "${barber.name}"? Quedará pausado para conservar sus citas históricas.`,
      )
    ) {
      return;
    }
    try {
      await deleteBarber.mutateAsync(barber.id);
    } catch {
      // El interceptor global ya informa el error de forma consistente.
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Equipo</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Barberos
          </h1>
        </div>
        <Button size="lg" disabled>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo barbero
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Equipo total</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">
              {barbers.length}
            </p>
            <p className="mt-1 text-sm text-secondary">Profesionales registrados</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Activos</p>
            <p className="mt-2 text-3xl font-semibold text-success">{activeCount}</p>
            <p className="mt-1 text-sm text-secondary">Aceptando reservas</p>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/88">
          <CardContent className="p-5">
            <p className="text-sm text-secondary">Pausados</p>
            <p className="mt-2 text-3xl font-semibold text-warning">{inactiveCount}</p>
            <p className="mt-1 text-sm text-secondary">Necesitan revisión</p>
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/70 bg-white/88">
        <CardHeader>
          <CardTitle>Roster del equipo</CardTitle>
          <p className="mt-2 text-sm text-secondary">
            Gestiona el equipo y configura la disponibilidad de cada barbero.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : barbers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white/60 p-4 text-sm text-muted-foreground">
              Aún no hay barberos registrados.
            </p>
          ) : (
            barbers.map((barber) => (
              <div
                key={barber.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-white/82 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-base font-semibold text-foreground">
                    {barber.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{barber.name}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          barber.active
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {barber.active ? "Activo" : "Pausado"}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">{barber.specialty ?? "—"}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-current text-primary" />
                        {barber.rating} · calificación
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(barber)}
                    disabled={updateBarber.isPending || deleteBarber.isPending}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Eliminar a ${barber.name}`}
                    onClick={() => onDelete(barber)}
                    disabled={updateBarber.isPending || deleteBarber.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/barbers/${barber.id}/schedule`}>
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Ver horarios
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-border bg-white p-0 shadow-2xl backdrop:bg-black/40"
      >
        <form
          method="dialog"
          className="w-[28rem] max-w-[92vw] space-y-4 p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-lg font-semibold">Editar barbero</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input placeholder="Nombre completo" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Especialidad</label>
            <Input
              placeholder="Cortes y diseño"
              {...form.register("specialty")}
            />
            {form.formState.errors.specialty ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.specialty.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Calificación</label>
            <Input
              type="number"
              min={0}
              max={5}
              step={0.1}
              {...form.register("rating", { valueAsNumber: true })}
            />
            {form.formState.errors.rating ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.rating.message}
              </p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              {...form.register("active")}
            />
            <span>Disponible para reservar</span>
          </label>

          {form.formState.errors.root ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-white px-5 text-sm font-semibold hover:bg-accent"
              onClick={() => dialogRef.current?.close()}
            >
              Cancelar
            </button>
            <Button type="submit" disabled={updateBarber.isPending}>
              {updateBarber.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}