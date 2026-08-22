import type { Barber, Service } from "@/modules/shared/types";

export const guestBarbers: Barber[] = [
  {
    id: "barber-1",
    name: "Carlos Mendez",
    specialty: "Fade preciso y barba clásica",
    rating: 4.9,
    active: true,
  },
  {
    id: "barber-2",
    name: "Mateo Rios",
    specialty: "Cortes ejecutivos y styling",
    rating: 4.8,
    active: true,
  },
  {
    id: "barber-3",
    name: "Santiago Vera",
    specialty: "Texturas modernas y cuidado premium",
    rating: 4.7,
    active: true,
  },
];

// NOTE: `barbershopId` is required by the `Service` type since the backend
// started exposing it. The mock data is only consumed by `/guest/services` for
// visual preview when no real services exist; the value is a placeholder that
// matches none of the demo records.
const MOCK_BARBERSHOP_ID = "00000000-0000-0000-0000-000000000000";

export const guestServices: Service[] = [
  {
    id: "service-1",
    name: "Corte premium",
    duration: 30,
    price: 65000,
    barbershopId: MOCK_BARBERSHOP_ID,
    active: true,
  },
  {
    id: "service-2",
    name: "Barba y perfilado",
    duration: 30,
    price: 40000,
    barbershopId: MOCK_BARBERSHOP_ID,
    active: true,
  },
  {
    id: "service-3",
    name: "Experiencia completa",
    duration: 30,
    price: 98000,
    barbershopId: MOCK_BARBERSHOP_ID,
    active: true,
  },
];
