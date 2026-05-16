"use client"

import { Menu } from "lucide-react"
import { useUIStore } from "@/store/ui-store"

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <button onClick={toggleSidebar} className="mr-4 hidden md:flex">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="font-bold text-lg md:hidden text-primary">BarberWeb</div>
          <nav className="flex items-center">
            {/* Avatar Placeholder */}
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-primary/20">
              <span className="text-xs text-primary">U</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
