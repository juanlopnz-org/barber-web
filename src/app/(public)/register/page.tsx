import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Crear Cuenta</CardTitle>
          <p className="text-sm text-muted-foreground">Regístrate para reservar tu turno</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Nombre Completo</label>
            <Input type="text" placeholder="Juan Pérez" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <Input type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Teléfono</label>
            <Input type="tel" placeholder="+123456789" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Contraseña</label>
            <Input type="password" />
          </div>
          <Button className="w-full" asChild>
            <Link href="/dashboard">Registrarse</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿Ya tienes cuenta? <Link href="/login" className="text-primary hover:underline">Inicia Sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
