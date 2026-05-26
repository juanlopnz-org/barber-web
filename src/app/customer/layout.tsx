import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-72 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">
            <div className="mx-auto max-w-7xl p-4 md:p-8">
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
      </div>
    </ProtectedRoute>
  )
}
