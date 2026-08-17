"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/modules/shared/types";
import { guestSession } from "@/modules/shared/types";

const STORAGE_KEY = "barber-system-session";

interface SessionState {
  user: SessionUser;
  hasHydrated: boolean;
  setUser: (user: SessionUser) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: guestSession,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearSession: () => {
        // Hard reset: clear the persisted snapshot in localStorage so a
        // stale token can't survive even if state is restored elsewhere.
        if (typeof window !== "undefined") {
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch {
            // ignore quota / privacy errors
          }
        }
        set({ user: guestSession });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
