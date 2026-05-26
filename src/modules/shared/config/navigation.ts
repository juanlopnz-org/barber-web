import type { LucideIcon } from "lucide-react";
import { Calendar, Clock3, Home, Scissors, ShieldCheck, Users } from "lucide-react";
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
      description: "Tus próximas citas y accesos rápidos",
      icon: Home,
    },
    {
      href: "/customer/book",
      label: "Reservar",
      description: "Agenda un nuevo servicio",
      icon: Calendar,
    },
    {
      href: "/customer/barbers",
      label: "Barberos",
      description: "Consulta especialistas y disponibilidad",
      icon: Users,
    },
  ],
  BARBER: [
    {
      href: "/barber/dashboard",
      label: "Dashboard",
      description: "Resumen de agenda e ingresos",
      icon: Home,
    },
    {
      href: "/barber/appointments",
      label: "Citas",
      description: "Gestiona tus citas del día",
      icon: Clock3,
    },
    {
      href: "/barber/agenda",
      label: "Agenda",
      description: "Vista diaria y semanal",
      icon: Calendar,
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
      href: "/admin/barbers",
      label: "Barberos",
      description: "Gestiona equipo y horarios",
      icon: Users,
    },
    {
      href: "/admin/services",
      label: "Servicios",
      description: "Mantén tu catálogo actualizado",
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
