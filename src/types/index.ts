export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "BARBER" | "ADMIN";
  avatarUrl?: string;
}

export interface Barber {
  id: string;
  userId: string;
  specialty: string;
  rating: number;
  availableHours: string[];
}

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutos
  price: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  customerId: string;
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface SwapRequest {
  id: string;
  appointmentId: string;
  requestedById: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}
