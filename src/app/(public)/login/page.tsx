import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Iniciar Sesión</CardTitle>
          <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <Input type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Contraseña</label>
            <Input type="password" />
          </div>
          <Button className="w-full" asChild>
            <Link href="/dashboard">Ingresar</Link>
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Ingresar como Invitado
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿No tienes cuenta? <Link href="/register" className="text-primary hover:underline">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
