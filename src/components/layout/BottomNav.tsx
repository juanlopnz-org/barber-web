"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session"
import { navigationByRole } from "@/modules/shared/config/navigation"
import type { Role } from "@/modules/shared/types"

type AuthenticatedRole = Exclude<Role, "GUEST">

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuthSession()
  const role: AuthenticatedRole =
    user.authenticated && (user.role === "ADMIN" || user.role === "BARBER")
      ? user.role
      : "CUSTOMER"
  const links = navigationByRole[role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/70 bg-white/92 px-2 pb-safe pt-1 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-muted-foreground transition-colors",
                isActive ? "bg-accent text-foreground" : "hover:text-secondary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-none">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}