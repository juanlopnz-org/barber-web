"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/modules/shared/types";
import { guestSession } from "@/modules/shared/types";

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
      clearSession: () => set({ user: guestSession }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "barber-system-session",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
