"use client"

import { Bell, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useUIStore } from "@/store/ui-store"
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session"
import { navigationByRole } from "@/modules/shared/config/navigation"

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const pathname = usePathname()
  const { user } = useAuthSession()

  const role = user.authenticated && user.role !== "GUEST" ? user.role : null
  const links = role ? navigationByRole[role] : []
  const current =
    links.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)) ??
    links[0]

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        <button
          onClick={toggleSidebar}
          className="inline-flex rounded-xl border border-border bg-white p-2 text-secondary shadow-sm md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-foreground">
          {current?.label ?? "Barber System"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/85 text-secondary shadow-sm hover:bg-accent"
            aria-label="Notificaciones"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/35 text-sm font-semibold text-foreground">
            {(user.name || "Guest").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}