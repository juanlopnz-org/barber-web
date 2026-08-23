import { z } from "zod";

/**
 * Phone-first registration. Email is optional so customers without a
 * personal email can still create an account — the admin can reset their
 * password manually until WhatsApp self-service reset ships in Phase 4.
 */
export const registerSchema = z
  .object({
    name: z.string().min(3, "Ingresa tu nombre completo."),
    phone: z
      .string()
      .min(10, "Ingresa un teléfono válido.")
      .max(20, "Número demasiado largo.")
      .regex(/^(\+?\d[\d\s-]*)$/, "Solo dígitos, espacios o +."),
    email: z
      .string()
      .email("Ingresa un email válido.")
      .optional()
      .or(z.literal("")),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirma tu contraseña."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
