"use client"

import { Bell, Menu, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { useUIStore } from "@/store/ui-store"
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session"

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const pathname = usePathname()
  const { user } = useAuthSession()

  const sectionTitle = pathname.startsWith("/barber")
    ? "Centro de agenda"
    : pathname.startsWith("/admin")
      ? "Centro administrativo"
      : "Experiencia del cliente"

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 md:px-8">
        <button
          onClick={toggleSidebar}
          className="inline-flex rounded-2xl border border-border bg-white p-3 text-secondary shadow-sm md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Barber System</p>
          <h2 className="truncate text-xl font-semibold text-foreground">{sectionTitle}</h2>
        </div>
        <div className="hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Buscar citas, clientes o servicios" />
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white/80 text-secondary shadow-sm hover:bg-accent">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/85 px-3 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/35 text-sm font-semibold text-foreground">
              {(user.name || "Guest").slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-foreground">{user.name || "Invitado"}</p>
              <p className="text-xs text-muted-foreground">
                {user.authenticated ? user.role : "Sesión de prueba"}
              </p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
