import type { LucideIcon } from "lucide-react";
import { Calendar, CalendarDays, Clock3, Home, Scissors, ShieldCheck, Users } from "lucide-react";
import type { Role } from "@/modules/shared/types";

export type NavigationItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navigationByRole: Record<Exclude<Role, "GUEST">, NavigationItem[]> = {
  CUSTOMER: [
    {
      href: "/customer/dashboard",
      label: "Resumen",
      description: "Tus próximas citas",
      icon: Home,
    },
    {
      href: "/customer/book",
      label: "Reservar",
      description: "Agenda un servicio",
      icon: Calendar,
    },
    {
      href: "/customer/barbers",
      label: "Barberos",
      description: "Conoce al equipo",
      icon: Users,
    },
  ],
  BARBER: [
    {
      href: "/barber/dashboard",
      label: "Resumen",
      description: "Tu día en una vista",
      icon: Home,
    },
    {
      href: "/barber/appointments",
      label: "Citas",
      description: "Gestiona tu agenda",
      icon: Clock3,
    },
    {
      href: "/barber/schedule",
      label: "Horario",
      description: "Edita tu jornada y bloqueos",
      icon: CalendarDays,
    },
  ],
  ADMIN: [
    {
      href: "/admin/dashboard",
      label: "Panel",
      description: "Indicadores generales",
      icon: ShieldCheck,
    },
    {
      href: "/admin/agenda",
      label: "Agenda",
      description: "Citas y disponibilidad por barbero",
      icon: CalendarDays,
    },
    {
      href: "/admin/barbers",
      label: "Barberos",
      description: "Gestiona el equipo",
      icon: Users,
    },
    {
      href: "/admin/services",
      label: "Servicios",
      description: "Mantén el catálogo",
      icon: Scissors,
    },
  ],
};

export const guestNavigation: NavigationItem[] = [
  {
    href: "/guest/barbers",
    label: "Barberos",
    description: "Conoce al equipo y sus fortalezas",
    icon: Users,
  },
  {
    href: "/guest/services",
    label: "Servicios",
    description: "Explora opciones y precios",
    icon: Scissors,
  },
  {
    href: "/guest/booking",
    label: "Reservar",
    description: "Agenda sin crear una cuenta",
    icon: Calendar,
  },
];