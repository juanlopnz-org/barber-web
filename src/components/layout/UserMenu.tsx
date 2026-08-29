"use client";

import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";

/**
 * Avatar button that opens a dropdown with the logout action.
 * Built without an extra primitive dep: uses native button + refs +
 * outside-click + Escape handlers for accessibility.
 */
export function UserMenu() {
  const { user, logout } = useAuthSession();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const initials = (user.name || "Guest").slice(0, 2).toUpperCase();
  const displayName = user.name || "Invitado";
  const displayRole = user.role && user.role !== "GUEST" ? user.role : "";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menú de usuario"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/35 text-sm font-semibold text-foreground transition hover:bg-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-30 w-56 origin-top-right overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">
              {displayName}
            </p>
            {displayRole && (
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-secondary">
                {displayRole}
              </p>
            )}
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-secondary transition hover:bg-muted hover:text-foreground focus:bg-muted focus:outline-none"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
