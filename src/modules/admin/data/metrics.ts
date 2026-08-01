import type { Appointment, Barber } from "@/modules/shared/types";

export type AdminMetrics = {
  appointmentsToday: number;
  occupancyPercent: number;
  activeBarbers: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  cancellationRate: number;
};

export const adminMetrics: AdminMetrics = {
  appointmentsToday: 24,
  occupancyPercent: 78,
  activeBarbers: 3,
  weeklyRevenue: 6_240_000,
  monthlyRevenue: 26_980_000,
  cancellationRate: 6.4,
};

export const upcomingAppointments: Appointment[] = [
  {
    id: "adm-up-1",
    barberId: "barber-1",
    serviceId: "service-1",
    startTime: "2026-07-11T11:00:00",
    endTime: "2026-07-11T11:45:00",
    status: "BOOKED",
    customerId: "customer-4",
  },
  {
    id: "adm-up-2",
    barberId: "barber-2",
    serviceId: "service-3",
    startTime: "2026-07-11T12:00:00",
    endTime: "2026-07-11T13:15:00",
    status: "BOOKED",
    customerId: "customer-11",
  },
  {
    id: "adm-up-3",
    barberId: "barber-3",
    serviceId: "service-2",
    startTime: "2026-07-11T15:00:00",
    endTime: "2026-07-11T15:30:00",
    status: "CANCELLED",
    customerId: "customer-5",
  },
  {
    id: "adm-up-4",
    barberId: "barber-1",
    serviceId: "service-3",
    startTime: "2026-07-11T17:30:00",
    endTime: "2026-07-11T18:45:00",
    status: "BOOKED",
    customerId: "customer-8",
  },
  {
    id: "adm-up-5",
    barberId: "barber-2",
    serviceId: "service-1",
    startTime: "2026-07-11T18:00:00",
    endTime: "2026-07-11T18:45:00",
    status: "BOOKED",
    customerId: "customer-12",
  },
];

export type BarberPerformance = Barber & {
  joinedAt: string;
  completedAppointments: number;
  weeklyEarnings: number;
};

export const barberPerformance: BarberPerformance[] = [
  {
    id: "barber-1",
    name: "Carlos Mendez",
    specialty: "Fade preciso y barba clásica",
    rating: 4.9,
    active: true,
    joinedAt: "2024-03-12",
    completedAppointments: 412,
    weeklyEarnings: 2_180_000,
  },
  {
    id: "barber-2",
    name: "Mateo Rios",
    specialty: "Cortes ejecutivos y styling",
    rating: 4.8,
    active: true,
    joinedAt: "2024-08-04",
    completedAppointments: 358,
    weeklyEarnings: 2_120_000,
  },
  {
    id: "barber-3",
    name: "Santiago Vera",
    specialty: "Texturas modernas y cuidado premium",
    rating: 4.7,
    active: true,
    joinedAt: "2025-01-20",
    completedAppointments: 224,
    weeklyEarnings: 1_940_000,
  },
  {
    id: "barber-4",
    name: "Andrés Castaño",
    specialty: "Diseños y color",
    rating: 4.6,
    active: false,
    joinedAt: "2025-05-02",
    completedAppointments: 78,
    weeklyEarnings: 0,
  },
];