import { z } from "zod";

/**
 * Phone-first login. The backend normalizes the phone server-side
 * (10-digit Colombian shortcut → +57..., or full E.164).
 */
export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Ingresa tu número de teléfono (mínimo 10 dígitos).")
    .max(20, "Número demasiado largo.")
    .regex(/^(\+?\d[\d\s-]*)$/, "Solo dígitos, espacios o +."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
