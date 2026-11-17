"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"
import { BrandLogo } from "@/components/brand/BrandLogo"
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
  const { user } = useAuthSession()
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 border-r border-white/10 bg-graphite shadow-2xl transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-screen flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <Link href="/" className="min-w-0" aria-label="Barber System">
                <BrandLogo size={44} stacked />
              </Link>
              <button
                className="rounded-xl p-2 text-white/60 hover:bg-white/10 hover:text-white md:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
              {role === "CUSTOMER" && "Reserva, consulta disponibilidad y sigue tus próximas citas."}
              {role === "BARBER" && "Gestiona tu agenda diaria con una experiencia limpia y enfocada."}
              {role === "ADMIN" && "Supervisa equipo, servicios y métricas desde un solo lugar."}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
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
                        ? "bg-chrome text-[#0a0d12] shadow-chrome"
                        : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 rounded-xl p-2",
                      isActive ? "bg-black/10 text-[#0a0d12]" : "bg-white/[0.07] text-white/75 group-hover:bg-white/[0.12]"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{link.label}</p>
                      <p className={cn("text-xs", isActive ? "text-[#0a0d12]/70" : "text-white/50")}>{link.description}</p>
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}
