"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session"
import { navigationByRole } from "@/modules/shared/config/navigation"
import type { Role } from "@/modules/shared/types"

type AuthenticatedRole = Exclude<Role, "GUEST">

const SEGMENT_TO_ROLE: Array<{ prefix: string; role: AuthenticatedRole }> = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/barber", role: "BARBER" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()
  const { user, logout } = useAuthSession()
  const segmentRole = SEGMENT_TO_ROLE.find((entry) => pathname.startsWith(entry.prefix))?.role
  const role: AuthenticatedRole =
    user.authenticated && user.role !== "GUEST"
      ? user.role
      : segmentRole ?? "CUSTOMER"
  const links = navigationByRole[role]

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#384959]/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 border-r border-white/10 bg-[#384959] text-white shadow-2xl transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Barber System</p>
              <div className="mt-2 font-semibold text-xl text-white">Operación clara y premium</div>
            </div>
            <button
              className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/72">
            {role === "CUSTOMER" && "Reserva, consulta disponibilidad y sigue tus próximas citas."}
            {role === "BARBER" && "Gestiona tu agenda diaria con una experiencia limpia y enfocada."}
            {role === "ADMIN" && "Supervisa equipo, servicios y métricas desde un solo lugar."}
          </p>
        </div><div className="flex h-screen flex-col px-4 py-5">
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-start gap-3 rounded-2xl px-4 py-3 transition-all",
                    isActive
                      ? "bg-white text-[#384959] shadow-soft"
                      : "text-white/72 hover:bg-white/8 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 rounded-xl p-2",
                    isActive ? "bg-primary/25 text-[#384959]" : "bg-white/8 text-white/80 group-hover:bg-white/12"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{link.label}</p>
                    <p className={cn("text-xs", isActive ? "text-[#384959]/70" : "text-white/55")}>{link.description}</p>
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 pt-5">
            <button
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-white/72 hover:bg-white/8 hover:text-white transition-colors"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}