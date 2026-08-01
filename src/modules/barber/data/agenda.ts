import type { Appointment, AppointmentStatus } from "@/modules/shared/types";

export type AgendaSlot = {
  startTime: string;
  endTime: string;
  barberId: string;
  appointment: Appointment | null;
};

type RawAppointment = Omit<Appointment, "startTime" | "endTime" | "barberId">;

const agendaDate = "2026-07-11";
const SLOT_DURATION_MIN = 30;

const TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

const barberOne: Record<string, RawAppointment | null> = {
  "09:00": { id: "ag-1", serviceId: "service-1", customerId: "customer-2", status: "BOOKED" },
  "10:00": { id: "ag-2", serviceId: "service-2", customerId: "customer-3", status: "BOOKED" },
  "11:00": { id: "ag-3", serviceId: "service-3", customerId: "customer-4", status: "BOOKED" },
  "14:00": { id: "ag-4", serviceId: "service-1", customerId: "customer-5", status: "BOOKED" },
  "15:00": { id: "ag-5", serviceId: "service-2", customerId: "customer-6", status: "SWAP_PENDING" },
  "16:30": { id: "ag-6", serviceId: "service-1", customerId: "customer-7", status: "OFFERED" },
  "17:30": { id: "ag-7", serviceId: "service-3", customerId: "customer-8", status: "BOOKED" },
};

const barberTwo: Record<string, RawAppointment | null> = {
  "09:00": { id: "ag-8", serviceId: "service-2", customerId: "customer-9", status: "BOOKED" },
  "10:30": { id: "ag-9", serviceId: "service-1", customerId: "customer-10", status: "COMPLETED" },
  "12:00": { id: "ag-10", serviceId: "service-3", customerId: "customer-11", status: "BOOKED" },
  "14:00": { id: "ag-11", serviceId: "service-1", customerId: "customer-12", status: "BOOKED" },
  "16:00": { id: "ag-12", serviceId: "service-2", customerId: "customer-13", status: "BOOKED" },
};

const barberThree: Record<string, RawAppointment | null> = {
  "10:00": { id: "ag-13", serviceId: "service-1", customerId: "customer-2", status: "BOOKED" },
  "11:30": { id: "ag-14", serviceId: "service-3", customerId: "customer-4", status: "BOOKED" },
  "15:00": { id: "ag-15", serviceId: "service-2", customerId: "customer-5", status: "CANCELLED" },
  "17:00": { id: "ag-16", serviceId: "service-1", customerId: "customer-6", status: "BOOKED" },
};

const DATA_BY_BARBER: Record<string, Record<string, RawAppointment | null>> = {
  "barber-1": barberOne,
  "barber-2": barberTwo,
  "barber-3": barberThree,
};

function buildSlotsForBarber(barberId: string): AgendaSlot[] {
  const data = DATA_BY_BARBER[barberId] ?? {};
  return TIMES.map((time) => {
    const start = new Date(`${agendaDate}T${time}:00`);
    const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60_000);
    const raw = data[time] ?? null;
    const appointment = raw
      ? {
          ...raw,
          barberId,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }
      : null;
    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      barberId,
      appointment,
    };
  });
}

export const agendaBarberIds = ["barber-1", "barber-2", "barber-3"] as const;

export const agendaSlots: AgendaSlot[] = agendaBarberIds.flatMap((id) =>
  buildSlotsForBarber(id)
);

export type AgendaStatusFilter = AppointmentStatus | "ALL" | "FREE";

export const AGENDA_STATUS_FILTERS: AgendaStatusFilter[] = [
  "ALL",
  "FREE",
  "BOOKED",
  "SWAP_PENDING",
  "OFFERED",
  "COMPLETED",
  "CANCELLED",
];