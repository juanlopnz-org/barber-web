"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navigationByRole } from "@/modules/shared/config/navigation"

export function BottomNav() {
  const pathname = usePathname()
  const role = pathname.startsWith("/barber") ? "BARBER" : "CUSTOMER"
  const links = navigationByRole[role]

  return (
    <div className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-white/70 bg-white/88 px-2 pb-safe backdrop-blur-xl md:hidden">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl text-muted-foreground transition-colors",
              isActive ? "bg-accent text-foreground" : "hover:text-secondary"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
