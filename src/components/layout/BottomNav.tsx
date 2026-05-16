"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Users, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/barbers", label: "Barberos", icon: Users },
    { href: "/appointments", label: "Citas", icon: Calendar },
    { href: "/swaps", label: "Swaps", icon: Inbox },
  ]

  return (
    <div className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-background pb-safe md:hidden">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground hover:text-primary transition-colors",
              isActive && "text-primary"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
