"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Calendar, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import { loginSchema, type LoginFormValues } from "@/modules/auth/schemas/login-schema";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const { login, getErrorMessage } = useAuthSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setErrorMessage("");
      await login(values);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  });

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="hidden rounded-[2rem] bg-[#384959] p-10 text-white shadow-2xl lg:block">
        <p className="text-xs uppercase tracking-[0.24em] text-white/60">Acceso seguro</p>
        <h1 className="mt-6 text-4xl font-semibold leading-tight">
          Entra con tu número de teléfono y contraseña.
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-white/72">
          El identificador principal es tu teléfono. Si el barbero ya te agendó
          como invitado, al crear tu cuenta te mostramos cuántas citas están
          vinculadas para que las reconozcas.
        </p>
        <div className="mt-10 space-y-4">
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <p className="font-medium">Login por teléfono (E.164)</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="font-medium">Sesión alineada con roles y estado `GUEST`</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium">Tus citas previas se conservan al crear la cuenta</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-lg border-white/70 bg-white/88">
        <CardHeader className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">Bienvenido</p>
          <CardTitle className="text-3xl">Iniciar sesión</CardTitle>
          <p className="text-sm leading-6 text-secondary">
            Usa tu número de teléfono y la contraseña que asignaste al crear
            tu cuenta.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-foreground">
                Teléfono
              </label>
              <Input
                type="tel"
                inputMode="tel"
                placeholder="3001234567 o +573001234567"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-foreground">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-sm font-medium text-secondary hover:text-foreground"
                  title="Solicita al admin que restablezca tu contraseña por WhatsApp"
                  disabled
                >
                  Recuperar acceso
                </button>
              </div>
              <Input
                type="password"
                placeholder="Ingresa tu contraseña"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
              <p className="text-xs text-secondary">
                ¿Olvidaste tu contraseña? Pídele al admin que la restablezca
                (lo atenderá por WhatsApp).
              </p>
            </div>
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              <span className="inline-flex items-center">
                Entrar al sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link href="/guest/booking">Continuar como invitado</Link>
            </Button>
            <p className="text-center text-sm text-secondary">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-semibold text-foreground hover:text-secondary">
                Crea tu perfil
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
