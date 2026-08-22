"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
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
import { useSessionStore } from "@/store/session-store";
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
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  DAYS_OF_WEEK,
  clockToMinutes,
  formatClockRange,
  localDateTimeToUtcIso,
  minutesToClock,
} from "@/modules/booking/lib/time-format";
import type { BlockedTime, Schedule } from "@/modules/shared/types";

// ----------------------------------------------------------------------------
//  Schemas (RHF + Zod)
// ----------------------------------------------------------------------------

const scheduleSchema = z
  .object({
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Formato HH:mm requerido"),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Formato HH:mm requerido"),
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
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha requerida"),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Formato HH:mm requerido"),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Formato HH:mm requerido"),
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

export default function BarberSchedulePage() {
  const user = useSessionStore((state) => state.user);
  const { getErrorMessage } = useAuthSession();
  const barberId = user.barberId ?? null;

  const todayIso = new Date().toISOString().slice(0, 10);

  // ---------------------------------------------------------------------------
  //  Queries
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  //  Mutations
  // ---------------------------------------------------------------------------

  const createSchedule = useCreateSchedule(barberId ?? "");
  const updateSchedule = useUpdateSchedule(barberId ?? "");
  const deleteSchedule = useDeleteSchedule(barberId ?? "");
  const createBlock = useCreateBlockedTime(barberId ?? "");
  const deleteBlock = useDeleteBlockedTime(barberId ?? "");

  // ---------------------------------------------------------------------------
  //  Dialog refs (native <dialog>)
  // ---------------------------------------------------------------------------

  const scheduleDialogRef = useRef<HTMLDialogElement | null>(null);
  const blockDialogRef = useRef<HTMLDialogElement | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(
    null,
  );

  // ---------------------------------------------------------------------------
  //  Schedule form
  // ---------------------------------------------------------------------------

  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  function openCreateSchedule() {
    setEditingSchedule(null);
    scheduleForm.reset({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "18:00",
    });
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
        await updateSchedule.mutateAsync({
          id: editingSchedule.id,
          input: payload,
        });
      } else {
        await createSchedule.mutateAsync(payload);
      }
      scheduleDialogRef.current?.close();
    } catch (err) {
      scheduleForm.setError("root", { message: getErrorMessage(err) });
    }
  }

  // ---------------------------------------------------------------------------
  //  Block form
  // ---------------------------------------------------------------------------

  const blockForm = useForm<BlockedTimeFormValues>({
    resolver: zodResolver(blockedTimeSchema),
    defaultValues: {
      date: todayIso,
      startTime: "12:00",
      endTime: "13:00",
      reason: "",
    },
  });

  function openCreateBlock() {
    blockForm.reset({
      date: todayIso,
      startTime: "12:00",
      endTime: "13:00",
      reason: "",
    });
    blockDialogRef.current?.showModal();
  }

  async function onSubmitBlock(values: BlockedTimeFormValues) {
    try {
      const startTime = localDateTimeToUtcIso(values.date, values.startTime);
      const endTime = localDateTimeToUtcIso(values.date, values.endTime);
      if (!startTime || !endTime) {
        blockForm.setError("root", {
          message: "Fecha u hora inválida",
        });
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

  // ---------------------------------------------------------------------------
  //  Derived state (computed unconditionally — must run before any guard)
  // ---------------------------------------------------------------------------

  const schedulesByDay = useMemo(() => {
    const map = new Map<number, Schedule[]>();
    for (const s of schedules) {
      const arr = map.get(s.dayOfWeek) ?? [];
      arr.push(s);
      map.set(s.dayOfWeek, arr);
    }
    return map;
  }, [schedules]);

  const totalWeekMinutes = schedules.reduce(
    (sum, s) => sum + (s.endMinutes - s.startMinutes),
    0,
  );

  const upcomingBlocks = useMemo(
    () =>
      blockedTimes.filter(
        (b) => new Date(b.endTime).getTime() >= Date.now(),
      ),
    [blockedTimes],
  );

  // ---------------------------------------------------------------------------
  //  Render: guard
  // ---------------------------------------------------------------------------

  if (!barberId) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Tu cuenta no está vinculada a un barbero. Pide al administrador que
          vincule tu perfil a un barbero para gestionar horarios.
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  //  Render: main
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* ---------------------- Header ---------------------- */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Horario semanal
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Define los días y horas en que atiendes clientes. Los clientes
              solo podrán reservar dentro de estas ventanas y fuera de tus
              bloqueos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {fetchingSchedules && !loadingSchedules ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : null}
            <Button onClick={openCreateSchedule}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo bloque de horario
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* ---------------------- Weekly grid ---------------------- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DAYS_OF_WEEK.map((day) => {
          const slots = schedulesByDay.get(day.value) ?? [];
          return (
            <Card key={day.value} className="border-white/70 bg-white/88">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{day.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {slots.length} bloque{slots.length === 1 ? "" : "s"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingSchedules ? (
                  <div className="h-12 animate-pulse rounded-xl bg-muted/60" />
                ) : slots.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border bg-white/60 p-3 text-xs text-muted-foreground">
                    No atiendes este día
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
                        <span className="text-xs text-muted-foreground">
                          ({formatClockRange(
                            minutesToClock(s.startMinutes),
                            minutesToClock(s.endMinutes),
                          )})
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
                            if (
                              window.confirm(
                                `¿Eliminar el bloque ${minutesToClock(
                                  s.startMinutes,
                                )} – ${minutesToClock(s.endMinutes)}?`,
                              )
                            ) {
                              deleteSchedule.mutate(s.id, {
                                onError: (err) =>
                                  window.alert(getErrorMessage(err)),
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

      {/* ---------------------- Stats ---------------------- */}
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

      {/* ---------------------- Blocked times ---------------------- */}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock3 className="h-5 w-5 text-primary" />
              Bloqueos manuales
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Bloqueos puntuales (almuerzo, reuniones, vacaciones) que impiden
              reservar en ese rango horario.
            </p>
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
              No tienes bloqueos próximos. Los clientes pueden reservar en
              cualquier horario dentro de tu jornada.
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

      {/* ---------------------- Dialog: Schedule ---------------------- */}
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
            <Button type="submit" disabled={createSchedule.isPending || updateSchedule.isPending}>
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

      {/* ---------------------- Dialog: BlockedTime ---------------------- */}
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
            <label className="text-sm font-medium">
              Motivo (opcional)
            </label>
            <Input
              placeholder="Almuerzo, reunión, vacaciones…"
              {...blockForm.register("reason")}
            />
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