"use client";

import { format } from "date-fns";
import { Clock3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface TimeSlotGridProps {
  /** ISO start times returned by the backend. */
  slots: string[];
  /** Currently selected slot ISO (or null). */
  selected: string | null;
  onSelect: (iso: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Calendly-style grid of available time slots.
 *
 * Renders each ISO slot as a button labeled with the local HH:mm time.
 * The selected slot is highlighted. When `loading` is true, shows a
 * skeleton grid. When `slots` is empty (and not loading), shows an
 * empty-state message.
 */
export function TimeSlotGrid({
  slots,
  selected,
  onSelect,
  loading = false,
  emptyMessage = "No hay horarios disponibles para esta fecha. Prueba otro día o cambia el barbero.",
  className,
}: TimeSlotGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
          className,
        )}
        role="status"
        aria-busy="true"
        aria-label="Cargando horarios disponibles"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-2xl bg-muted/60"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div
        className={cn(
          "flex items-start gap-2 rounded-2xl border border-dashed border-border bg-white/60 p-4 text-sm text-muted-foreground",
          className,
        )}
        role="status"
      >
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
        className,
      )}
      role="listbox"
      aria-label="Horarios disponibles"
    >
      {slots.map((iso) => {
        const isSelected = iso === selected;
        const label = format(new Date(iso), "HH:mm");
        return (
          <Button
            key={iso}
            type="button"
            role="option"
            aria-selected={isSelected}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(iso)}
            className="font-mono tabular-nums"
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}