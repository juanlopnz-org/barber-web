"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { useBarberAppointments } from "@/modules/shared/hooks/use-barber-appointments";
import { useServices } from "@/modules/shared/hooks/use-services";
import {
  APPOINTMENT_STATUS_BADGE,
  APPOINTMENT_STATUS_FILTER_OPTIONS,
  appointmentStatusLabel,
} from "@/modules/shared/lib/appointment-status";
import type { AppointmentStatus } from "@/modules/shared/types";

export default function BarberAppointmentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [status, setStatus] = useState<AppointmentStatus | "ALL">("ALL");

  const { data, isLoading } = useBarberAppointments({
    page,
    pageSize,
    order: "desc",
    ...(status !== "ALL" ? { status } : {}),
  });
  const { data: services = [] } = useServices();

  const appointments = data?.items ?? [];
  const total = data?.total ?? 0;

  const serviceName = (id: string) =>
    services.find((s) => s.id === id)?.name ?? "—";
  const customerName = (guestName?: string | null, customerId?: string | null) =>
    guestName ?? (customerId ? `Cliente ${customerId.slice(0, 8)}` : "Cliente");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Citas</h1>
        <p className="mt-2 text-secondary">Listado de todas tus citas asignadas.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
          <CardTitle>Listado ({total})</CardTitle>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary">Estado</label>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as AppointmentStatus | "ALL");
                // A new filter invalidates the current page offset.
                setPage(1);
              }}
              className="h-9 rounded-xl border border-border bg-white/82 px-3 text-sm"
            >
              {APPOINTMENT_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-0">
          {isLoading ? (
            <p className="p-6 text-sm text-secondary">Cargando…</p>
          ) : appointments.length === 0 ? (
            <p className="p-6 text-sm text-secondary">No tienes citas asignadas.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {serviceName(a.serviceId)}
                    </p>
                    <p className="text-sm text-secondary">
                      {new Date(a.startTime).toLocaleString("es-CO")} ·{" "}
                      {customerName(a.guestName, a.customerId)}
                    </p>
                  </div>
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                      (APPOINTMENT_STATUS_BADGE[a.status] ??
                        "bg-muted text-secondary")
                    }
                  >
                    {appointmentStatusLabel(a.status)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(next) => {
              setPageSize(next);
              setPage(1);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
