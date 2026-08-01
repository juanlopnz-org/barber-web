export type ScheduleBlock = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
};

export type TodaySchedule = {
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  blocks: ScheduleBlock[];
};

export const todaySchedule: TodaySchedule = {
  barberId: "barber-1",
  date: "2026-07-11",
  startTime: "09:00",
  endTime: "19:30",
  isAvailable: true,
  blocks: [
    {
      id: "blk-1",
      label: "Almuerzo",
      startTime: "12:30",
      endTime: "13:30",
    },
    {
      id: "blk-2",
      label: "Reunión de equipo",
      startTime: "15:30",
      endTime: "16:00",
    },
    {
      id: "blk-3",
      label: "Mantenimiento",
      startTime: "18:00",
      endTime: "18:30",
    },
  ],
};

export function formatDuration(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}