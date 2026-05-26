import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Ingresa tu nombre completo."),
    phone: z.string().min(10, "Ingresa un teléfono válido."),
    email: z.email("Ingresa un email válido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirma tu contraseña."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
