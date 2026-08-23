"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Clock3,
  DollarSign,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/modules/shared/hooks/use-services";
import { useDefaultBarbershopId } from "@/modules/shared/hooks/use-barbershops";
import type { Service } from "@/modules/shared/types";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("es-CO")}`;
}

// ----------------------------------------------------------------------------
//  Schemas (RHF + Zod)
// ----------------------------------------------------------------------------

const serviceSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(120, "Máximo 120 caracteres"),
  duration: z
    .number()
    .int("Duración debe ser un entero")
    .min(5, "Mínimo 5 minutos")
    .max(480, "Máximo 8 horas"),
  price: z
    .number()
    .int("Precio en COP, sin centavos")
    .min(0, "El precio no puede ser negativo"),
  active: z.boolean().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

// ----------------------------------------------------------------------------
//  Page
// ----------------------------------------------------------------------------

export default function AdminServicesPage() {
  const { data: services = [], isLoading } = useServices();
  const { getErrorMessage } = useAuthSession();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { barbershopId: defaultBarbershopId, loading: loadingBarbershop } =
    useDefaultBarbershopId();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      duration: 30,
      price: 25000,
      active: true,
    },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", duration: 30, price: 25000, active: true });
    dialogRef.current?.showModal();
  }

  function openEdit(s: Service) {
    setEditing(s);
    form.reset({
      name: s.name,
      duration: s.duration,
      price: s.price,
      active: s.active,
    });
    dialogRef.current?.showModal();
  }

  async function onSubmit(values: ServiceFormValues) {
    if (!defaultBarbershopId) {
      form.setError("root", {
        message:
          "No se pudo determinar el barbershop. Verifica que existan servicios o barberos.",
      });
      return;
    }
    try {
      if (editing) {
        await updateService.mutateAsync({
          id: editing.id,
          input: {
            name: values.name,
            duration: values.duration,
            price: values.price,
            active: values.active,
          },
        });
      } else {
        await createService.mutateAsync({
          name: values.name,
          duration: values.duration,
          price: values.price,
          barbershopId: defaultBarbershopId,
          active: values.active,
        });
      }
      dialogRef.current?.close();
    } catch (err) {
      form.setError("root", { message: getErrorMessage(err) });
    }
  }

  async function onToggleActive(s: Service) {
    try {
      await updateService.mutateAsync({
        id: s.id,
        input: { active: !s.active },
      });
    } catch {
      // El interceptor global ya informa el error de forma consistente.
    }
  }

  async function onDelete(s: Service) {
    if (
      !window.confirm(
        `¿Eliminar el servicio "${s.name}"? Quedará pausado (soft-delete) para no romper citas pasadas.`,
      )
    ) {
      return;
    }
    try {
      await deleteService.mutateAsync(s.id);
    } catch {
      // El interceptor global ya informa el error de forma consistente.
    }
  }

  // ---------------------------------------------------------------------------
  //  Derived state
  // ---------------------------------------------------------------------------

  const summary = useMemo(() => {
    const active = services.filter((s) => s.active);
    const averagePrice =
      active.length > 0
        ? Math.round(
            active.reduce((sum, s) => sum + s.price, 0) / active.length,
          )
        : 0;
    const averageDuration =
      active.length > 0
        ? Math.round(
            active.reduce((sum, s) => sum + s.duration, 0) / active.length,
          )
        : 0;
    return {
      activeCount: active.length,
      total: services.length,
      averagePrice,
      averageDuration,
    };
  }, [services]);

  // ---------------------------------------------------------------------------
  //  Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Catálogo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Servicios
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestiona los servicios que se ofrecen a los clientes. Los
            servicios inactivos no aparecen en la reserva pública.
          </p>
        </div>
        <Button size="lg" onClick={openCreate} disabled={loadingBarbershop}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo servicio
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <SummaryCard
          label="Activos"
          value={`${summary.activeCount} / ${summary.total}`}
          hint="Disponibles para reservar"
        />
        <SummaryCard
          label="Precio promedio"
          value={formatCurrency(summary.averagePrice)}
          hint="Ticket medio del catálogo"
        />
        <SummaryCard
          label="Duración promedio"
          value={
            summary.averageDuration > 0
              ? `${summary.averageDuration} min`
              : "—"
          }
          hint="Bloques sugeridos de 30 minutos"
        />
      </div>

      <Card className="border-white/70 bg-white/88">
        <CardHeader>
          <CardTitle>Servicios publicados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white/60 p-4 text-sm text-muted-foreground">
              Aún no hay servicios. Crea el primero con el botón{" "}
              <strong>Nuevo servicio</strong>.
            </p>
          ) : (
            services.map((s) => (
              <ServiceRow
                key={s.id}
                service={s}
                onEdit={() => openEdit(s)}
                onToggleActive={() => onToggleActive(s)}
                onDelete={() => onDelete(s)}
                busy={
                  updateService.isPending && updateService.variables?.id === s.id
                }
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-2xl border border-border bg-white p-0 shadow-2xl backdrop:bg-black/40"
      >
        <form
          method="dialog"
          className="w-[28rem] max-w-[92vw] space-y-4 p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="text-lg font-semibold">
            {editing ? "Editar servicio" : "Nuevo servicio"}
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              placeholder="Corte clásico, Barba, Combo…"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duración (min)</label>
              <Input
                type="number"
                min={5}
                step={5}
                {...form.register("duration", { valueAsNumber: true })}
              />
              {form.formState.errors.duration ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.duration.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio (COP)</label>
              <Input
                type="number"
                min={0}
                step={500}
                {...form.register("price", { valueAsNumber: true })}
              />
              {form.formState.errors.price ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.price.message}
                </p>
              ) : null}
            </div>
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
            <Button
              type="submit"
              disabled={createService.isPending || updateService.isPending}
            >
              {createService.isPending || updateService.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : editing ? (
                "Guardar cambios"
              ) : (
                "Crear servicio"
              )}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function ServiceRow({
  service,
  onEdit,
  onToggleActive,
  onDelete,
  busy,
}: {
  service: Service;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white/82 p-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{service.name}</p>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
              service.active
                ? "bg-success/15 text-success"
                : "bg-warning/15 text-warning"
            }`}
          >
            {service.active ? "Activo" : "Pausado"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-secondary">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-4 w-4" />
            {service.duration} min
          </span>
          <span className="inline-flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            {formatCurrency(service.price)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={onEdit} disabled={busy}>
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          size="sm"
          variant={service.active ? "ghost" : "default"}
          onClick={onToggleActive}
          disabled={busy}
        >
          {service.active ? "Pausar" : "Activar"}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Eliminar"
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-white/70 bg-white/88">
      <CardContent className="p-4">
        <p className="text-xs text-secondary">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-secondary">{hint}</p>
      </CardContent>
    </Card>
  );
}
