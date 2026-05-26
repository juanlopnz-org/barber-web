import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function BarberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["BARBER"]}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="md:pl-72 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
