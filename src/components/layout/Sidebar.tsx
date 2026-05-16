"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Users, Inbox, LogOut, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()

  const links = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/barbers", label: "Explorar Barberos", icon: Users },
    { href: "/appointments", label: "Mis Citas", icon: Calendar },
    { href: "/swaps", label: "Muro y Swaps", icon: Inbox },
    { href: "/settings", label: "Configuración", icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-card transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-border">
          <div className="font-bold text-xl text-primary">BarberWeb</div>
          <button 
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-3.5rem)] justify-between p-4">
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border pt-4">
            <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
