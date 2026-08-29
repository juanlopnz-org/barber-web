"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CheckCircle2, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthSession } from "@/modules/auth/hooks/use-auth-session";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/schemas/register-schema";
import { checkPhoneApi, type CheckPhoneResponse } from "@/modules/auth/services/api-auth";

type Step = "phone" | "form";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneCheck, setPhoneCheck] = useState<CheckPhoneResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const { register: registerUser, getErrorMessage } = useAuthSession();
  const {
    register,
    handleSubmit,
    setValue,
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

  async function onCheckPhone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhoneError(null);
    setPhoneCheck(null);
    const trimmed = phoneInput.trim();
    if (trimmed.length < 10) {
      setPhoneError("Ingresa al menos 10 dígitos.");
      return;
    }
    setChecking(true);
    try {
      const result = await checkPhoneApi(trimmed);
      setPhoneCheck(result);
      setValue("phone", trimmed);
      setStep("form");
    } catch (err) {
      setPhoneError(getErrorMessage(err));
    } finally {
      setChecking(false);
    }
  }

  function onBackToPhone() {
    setStep("phone");
    setErrorMessage("");
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      setErrorMessage("");
      await registerUser(values);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 lg:px-8">
      <Card className="w-full max-w-4xl overflow-hidden border-white/70 bg-white/88">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="surface-muted border-b border-border p-8 lg:border-b-0 lg:border-r">
            <p className="text-xs uppercase tracking-[0.24em] text-secondary">Registro</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground">
              Primero tu teléfono.
            </h1>
            <p className="mt-4 text-sm leading-7 text-secondary">
              Si el barbero ya te agendó antes, te avisamos cuántas citas están
              vinculadas a tu número. Después continuas con tu nombre y una
              contraseña.
            </p>
            <ol className="mt-8 space-y-3 text-sm">
              <StepBadge active={step === "phone"} done={step === "form"} n={1} label="Verifica tu teléfono" />
              <StepBadge active={step === "form"} done={false} n={2} label="Crea tu contraseña" />
            </ol>
          </aside>

          <div className="p-8">
            {step === "phone" ? (
              <PhoneStep
                phoneInput={phoneInput}
                onChange={setPhoneInput}
                onSubmit={onCheckPhone}
                error={phoneError}
                loading={checking}
              />
            ) : (
              <FormStep
                register={register}
                errors={errors}
                errorMessage={errorMessage}
                onBack={onBackToPhone}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                phoneCheck={phoneCheck}
                phoneInput={phoneInput}
              />
            )}

            <p className="mt-6 text-center text-sm text-secondary">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-foreground hover:text-secondary">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PhoneStep({
  phoneInput,
  onChange,
  onSubmit,
  error,
  loading,
}: {
  phoneInput: string;
  onChange: (next: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="text-3xl">¿Cuál es tu número?</CardTitle>
        <p className="text-sm leading-6 text-secondary">
          Lo usamos como identificador principal y para enviarte notificaciones
          por WhatsApp cuando agendes o te agenden.
        </p>
      </CardHeader>
      <CardContent className="mt-6 p-0">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Teléfono</label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <Input
                type="tel"
                inputMode="tel"
                autoFocus
                placeholder="3001234567 o +573001234567"
                value={phoneInput}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <p className="text-xs text-secondary">
              Formatos aceptados: 10 dígitos (3001234567) o E.164 (+573001234567).
            </p>
          </div>
          <Button className="w-full" size="lg" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando…
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </>
  );
}

function FormStep({
  register,
  errors,
  errorMessage,
  onBack,
  onSubmit,
  isSubmitting,
  phoneCheck,
  phoneInput,
}: {
  register: ReturnType<typeof useForm<RegisterFormValues>>["register"];
  errors: ReturnType<typeof useForm<RegisterFormValues>>["formState"]["errors"];
  errorMessage: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  phoneCheck: CheckPhoneResponse | null;
  phoneInput: string;
}) {
  return (
    <>
      <CardHeader className="p-0">
        <CardTitle className="text-3xl">Crea tu contraseña</CardTitle>
        <p className="text-sm leading-6 text-secondary">
          Tu número <span className="font-semibold text-foreground">{phoneInput}</span> será tu usuario
          para iniciar sesión.
        </p>
      </CardHeader>

      {phoneCheck?.exists && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-success/40 bg-success/10 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <div>
            <p className="font-semibold text-foreground">
              ¡Hola {phoneCheck.customerName ?? "de nuevo"}!
            </p>
            <p className="text-secondary">
              Encontramos {phoneCheck.linkedAppointments ?? 0} cita(s) agendada(s)
              con este número. Al crear tu cuenta las podrás ver y gestionar
              desde tu panel.
            </p>
          </div>
        </div>
      )}

      <CardContent className="mt-6 p-0">
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre completo</label>
            <Input
              type="text"
              placeholder={phoneCheck?.customerName ?? "Juan Pérez"}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Teléfono (confirmar)</label>
            <Input type="tel" readOnly value={phoneInput} {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email <span className="text-secondary">(opcional)</span>
            </label>
            <Input
              type="email"
              placeholder="Tu email personal si lo tienes"
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            <p className="text-xs text-secondary">
              Útil si más adelante quieres recuperar tu cuenta por correo.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
              <Input
                type="password"
                placeholder="Repite tu contraseña"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" type="button" onClick={onBack}>
              Cambiar teléfono
            </Button>
            <Button className="flex-1" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta…" : "Crear mi cuenta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}

function StepBadge({
  active,
  done,
  n,
  label,
}: {
  active: boolean;
  done: boolean;
  n: number;
  label: string;
}) {
  const tone = done
    ? "border-success/40 bg-success/15 text-success"
    : active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border bg-white/70 text-secondary";
  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${tone}`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
        {done ? <CheckCircle2 className="h-4 w-4" /> : n}
      </span>
      {label}
    </li>
  );
}
