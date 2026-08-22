"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBarbers } from "@/modules/shared/hooks/use-barbers";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  useBlockedTimes,
  useCreateBlockedTime,
  useDeleteBlockedTime,
} from "@/modules/shared/hooks/use-blocked-times";
import {
  useCreateSchedule,
  useDeleteSchedule,
  useSchedules,
  useUpdateSchedule,
} from "@/modules/shared/hooks/use-schedules";
import {
  DAYS_OF_WEEK,
  clockToMinutes,
  formatClockRange,
  localDateTimeToUtcIso,
  minutesToClock,
} from "@/modules/booking/lib/time-format";
import type { BlockedTime, Schedule } from "@/modules/shared/types";

// ----------------------------------------------------------------------------
//  Schemas
// ----------------------------------------------------------------------------

const scheduleSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })
  .refine(
    (v) => {
      const s = clockToMinutes(v.startTime);
      const e = clockToMinutes(v.endTime);
      return s !== null && e !== null && e > s;
    },
    { message: "La hora final debe ser mayor a la inicial", path: ["endTime"] },
  );
type ScheduleFormValues = z.infer<typeof scheduleSchema>;

const blockedTimeSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    reason: z.string().max(120).optional(),
  })
  .refine(
    (v) => {
      const s = clockToMinutes(v.startTime);
      const e = clockToMinutes(v.endTime);
      return s !== null && e !== null && e > s;
    },
    { message: "La hora final debe ser mayor a la inicial", path: ["endTime"] },
  );
type BlockedTimeFormValues = z.infer<typeof blockedTimeSchema>;

// ----------------------------------------------------------------------------
//  Page
// ----------------------------------------------------------------------------

export default function AdminBarberSchedulePage() {
  const params = useParams<{ id: string }>();
  const barberId = params?.id ?? "";
  const { data: barbers = [], isLoading: loadingBarbers } = useBarbers();
  const { getErrorMessage } = useAuthSession();

  const barber = useMemo(
    () => barbers.find((b) => b.id === barberId) ?? null,
    [barbers, barberId],
  );

  const todayIso = new Date().toISOString().slice(0, 10);

  const {
    data: schedules = [],
    isLoading: loadingSchedules,
    isFetching: fetchingSchedules,
  } = useSchedules(barberId);

  const {
    data: blockedTimes = [],
    isLoading: loadingBlocks,
  } = useBlockedTimes({
    barberId,
    // Start of "today" in the user's local timezone (Bogota). Sending
    // `T00:00:00.000Z` would shift the lower bound to 19:00 of the previous
    // day and could exclude in-progress blockades.
    from: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
  });

  const createSchedule = useCreateSchedule(barberId);
  const updateSchedule = useUpdateSchedule(barberId);
  const deleteSchedule = useDeleteSchedule(barberId);
  const createBlock = useCreateBlockedTime(barberId);
  const deleteBlock = useDeleteBlockedTime(barberId);

  const scheduleDialogRef = useRef<HTMLDialogElement | null>(null);
  const blockDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // ----- schedule form -----
  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
  });
  function openCreateSchedule() {
    setEditingSchedule(null);
    scheduleForm.reset({ dayOfWeek: 1, startTime: "09:00", endTime: "18:00" });
    scheduleDialogRef.current?.showModal();
  }
  function openEditSchedule(s: Schedule) {
    setEditingSchedule(s);
    scheduleForm.reset({
      dayOfWeek: s.dayOfWeek,
      startTime: minutesToClock(s.startMinutes),
      endTime: minutesToClock(s.endMinutes),
    });
    scheduleDialogRef.current?.showModal();
  }
  async function onSubmitSchedule(values: ScheduleFormValues) {
    try {
      const payload = {
        dayOfWeek: values.dayOfWeek,
        startMinutes: clockToMinutes(values.startTime)!,
        endMinutes: clockToMinutes(values.endTime)!,
      };
      if (editingSchedule) {
        await updateSchedule.mutateAsync({ id: editingSchedule.id, input: payload });
      } else {
        await createSchedule.mutateAsync(payload);
      }
      scheduleDialogRef.current?.close();
    } catch (err) {
      scheduleForm.setError("root", { message: getErrorMessage(err) });
    }
  }

  // ----- block form -----
  const blockForm = useForm<BlockedTimeFormValues>({
    resolver: zodResolver(blockedTimeSchema),
    defaultValues: { date: todayIso, startTime: "12:00", endTime: "13:00", reason: "" },
  });
  function openCreateBlock() {
    blockForm.reset({ date: todayIso, startTime: "12:00", endTime: "13:00", reason: "" });
    blockDialogRef.current?.showModal();
  }
  async function onSubmitBlock(values: BlockedTimeFormValues) {
    try {
      const startTime = localDateTimeToUtcIso(values.date, values.startTime);
      const endTime = localDateTimeToUtcIso(values.date, values.endTime);
      if (!startTime || !endTime) {
        blockForm.setError("root", { message: "Fecha u hora inválida" });
        return;
      }
      await createBlock.mutateAsync({
        startTime,
        endTime,
        reason: values.reason?.trim() || undefined,
      });
      blockDialogRef.current?.close();
    } catch (err) {
      blockForm.setError("root", { message: getErrorMessage(err) });
    }
  }

  if (loadingBarbers) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!barber) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6">
          <p className="text-sm text-muted-foreground">Barbero no encontrado.</p>
          <Button variant="outline" asChild={false}>
            <Link href="/admin/barbers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const schedulesByDay = new Map<number, Schedule[]>();
  for (const s of schedules) {
    const arr = schedulesByDay.get(s.dayOfWeek) ?? [];
    arr.push(s);
    schedulesByDay.set(s.dayOfWeek, arr);
  }
  const totalWeekMinutes = schedules.reduce(
    (sum, s) => sum + (s.endMinutes - s.startMinutes),
    0,
  );
  const upcomingBlocks = blockedTimes.filter(
    (b) => new Date(b.endTime).getTime() >= Date.now(),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" asChild={false}>
          <Link href="/admin/barbers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Barberos
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">{barber.name}</span>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Horario semanal
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Disponibilidad de {barber.name}. Los clientes solo pueden reservar
              dentro de estas ventanas y fuera de los bloqueos manuales.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {fetchingSchedules && !loadingSchedules ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : null}
            <Button onClick={openCreateSchedule}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo bloque
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DAYS_OF_WEEK.map((day) => {
          const slots = schedulesByDay.get(day.value) ?? [];
          return (
            <Card key={day.value} className="border-white/70 bg-white/88">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{day.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {slots.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingSchedules ? (
                  <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
                ) : slots.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border bg-white/60 p-3 text-xs text-muted-foreground">
                    Sin horario
                  </p>
                ) : (
                  slots.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-white/82 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm">
                          {minutesToClock(s.startMinutes)} –{" "}
                          {minutesToClock(s.endMinutes)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Editar"
                          onClick={() => openEditSchedule(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Eliminar"
                          onClick={() => {
                            if (window.confirm("¿Eliminar este bloque?")) {
                              deleteSchedule.mutate(s.id, {
                                onError: (err) => window.alert(getErrorMessage(err)),
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between p-5 text-sm">
          <span className="text-muted-foreground">
            Disponibilidad semanal total:{" "}
            <strong className="text-foreground">
              {Math.floor(totalWeekMinutes / 60)} h{" "}
              {totalWeekMinutes % 60 > 0 ? `${totalWeekMinutes % 60} min` : ""}
            </strong>
          </span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock3 className="h-5 w-5 text-primary" />
              Bloqueos manuales
            </CardTitle>
          </div>
          <Button variant="outline" onClick={openCreateBlock}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar bloqueo
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {loadingBlocks ? (
            <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
          ) : upcomingBlocks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-white/60 p-4 text-sm text-muted-foreground">
              Sin bloqueos próximos.
            </p>
          ) : (
            upcomingBlocks.map((b) => (
              <BlockedTimeRow
                key={b.id}
                blockedTime={b}
                onDelete={() => {
                  if (window.confirm("¿Eliminar este bloqueo?")) {
                    deleteBlock.mutate(b.id, {
                      onError: (err) => window.alert(getErrorMessage(err)),
                    });
                  }
                }}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog: Schedule */}
      <dialog
        ref={scheduleDialogRef}
        className="rounded-2xl border border-border bg-white p-0 shadow-2xl backdrop:bg-black/40"
      >
        <form
          method="dialog"
          className="w-[28rem] max-w-[92vw] space-y-4 p-6"
          onSubmit={scheduleForm.handleSubmit(onSubmitSchedule)}
        >
          <h2 className="text-lg font-semibold">
            {editingSchedule ? "Editar bloque de horario" : "Nuevo bloque de horario"}
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Día de la semana</label>
            <select
              className="flex h-11 w-full rounded-2xl border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-ring"
              {...scheduleForm.register("dayOfWeek", { valueAsNumber: true })}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora inicio</label>
              <Input type="time" {...scheduleForm.register("startTime")} />
              {scheduleForm.formState.errors.startTime ? (
                <p className="text-xs text-destructive">
                  {scheduleForm.formState.errors.startTime.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora fin</label>
              <Input type="time" {...scheduleForm.register("endTime")} />
              {scheduleForm.formState.errors.endTime ? (
                <p className="text-xs text-destructive">
                  {scheduleForm.formState.errors.endTime.message}
                </p>
              ) : null}
            </div>
          </div>
          {scheduleForm.formState.errors.root ? (
            <p className="text-sm text-destructive">
              {scheduleForm.formState.errors.root.message}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-white px-5 text-sm font-semibold hover:bg-accent"
              onClick={() => scheduleDialogRef.current?.close()}
            >
              Cancelar
            </button>
            <Button
              type="submit"
              disabled={createSchedule.isPending || updateSchedule.isPending}
            >
              {createSchedule.isPending || updateSchedule.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : editingSchedule ? (
                "Guardar cambios"
              ) : (
                "Crear bloque"
              )}
            </Button>
          </div>
        </form>
      </dialog>

      {/* Dialog: BlockedTime */}
      <dialog
        ref={blockDialogRef}
        className="rounded-2xl border border-border bg-white p-0 shadow-2xl backdrop:bg-black/40"
      >
        <form
          method="dialog"
          className="w-[28rem] max-w-[92vw] space-y-4 p-6"
          onSubmit={blockForm.handleSubmit(onSubmitBlock)}
        >
          <h2 className="text-lg font-semibold">Nuevo bloqueo</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha</label>
            <Input type="date" min={todayIso} {...blockForm.register("date")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora inicio</label>
              <Input type="time" {...blockForm.register("startTime")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hora fin</label>
              <Input type="time" {...blockForm.register("endTime")} />
              {blockForm.formState.errors.endTime ? (
                <p className="text-xs text-destructive">
                  {blockForm.formState.errors.endTime.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Motivo (opcional)</label>
            <Input placeholder="Almuerzo, reunión…" {...blockForm.register("reason")} />
          </div>
          {blockForm.formState.errors.root ? (
            <p className="text-sm text-destructive">
              {blockForm.formState.errors.root.message}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-white px-5 text-sm font-semibold hover:bg-accent"
              onClick={() => blockDialogRef.current?.close()}
            >
              Cancelar
            </button>
            <Button type="submit" disabled={createBlock.isPending}>
              {createBlock.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Crear bloqueo"
              )}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function BlockedTimeRow({
  blockedTime,
  onDelete,
}: {
  blockedTime: BlockedTime;
  onDelete: () => void;
}) {
  const start = new Date(blockedTime.startTime);
  const end = new Date(blockedTime.endTime);
  const dateStr = start.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const fmt = (d: Date) =>
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-white/82 p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-accent px-3 py-2 text-center">
          <p className="text-[10px] uppercase tracking-wide text-secondary">
            {dateStr}
          </p>
          <p className="text-xs font-semibold text-foreground">
            {fmt(start)} – {fmt(end)}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {blockedTime.reason ?? "Bloqueo"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatClockRange(
              `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
              `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
            )}
          </p>
        </div>
      </div>
      <Button size="icon" variant="ghost" aria-label="Eliminar" onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}