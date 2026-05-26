 "use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/schemas/register-schema";

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const { register: registerUser } = useAuthSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setErrorMessage("");
      await registerUser(values);
    } catch {
      setErrorMessage("No fue posible crear la cuenta. Intenta de nuevo.");
    }
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 lg:px-8">
      <Card className="w-full max-w-4xl overflow-hidden border-white/70 bg-white/88">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="surface-muted border-b border-border p-8 lg:border-b-0 lg:border-r">
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">Registro</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground">
              Crea una cuenta para reservar y seguir tu historial.
            </h1>
            <p className="mt-4 text-sm leading-7 text-secondary">
              Esta primera iteración deja lista la estructura para migrar este formulario a React Hook Form + Zod sin rehacer la UI.
            </p>
            <div className="mt-8 space-y-3">
              {["Perfil del cliente", "Acceso a futuras citas", "Base preparada para validaciones reales"].map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm font-medium text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl">Crear cuenta</CardTitle>
              <p className="text-sm leading-6 text-secondary">
                Completa tus datos para dejar lista tu experiencia autenticada.
              </p>
            </CardHeader>
            <CardContent className="mt-6 p-0">
              <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nombre completo</label>
                  <Input type="text" placeholder="Juan Pérez" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Teléfono</label>
                  <Input type="tel" placeholder="+57 300 000 0000" {...register("phone")} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="correo@barbersystem.com" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contraseña</label>
                  <Input type="password" placeholder="Mínimo 8 caracteres" {...register("password")} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
                  <Input type="password" placeholder="Repite tu contraseña" {...register("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
                </div>
              </div>
              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                Crear mi cuenta
              </Button>
              <p className="text-center text-sm text-secondary">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-semibold text-foreground hover:text-secondary">
                  Inicia sesión
                </Link>
              </p>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
