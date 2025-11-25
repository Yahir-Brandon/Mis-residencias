import * as z from 'zod';

const passwordValidation = z
  .string()
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una mayúscula." })
  .regex(/[a-z]/, { message: "La contraseña debe contener al menos una minúscula." })
  .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." })
  .regex(/[^A-Za-z0-9]/, { message: "La contraseña debe contener al menos un símbolo especial." });

export const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
});

export const personalSignupSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es requerido." }),
  lastName: z.string().min(1, { message: "El apellido es requerido." }),
  phone: z.string().min(10, { message: "El número de teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, "Solo se permiten números."),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: passwordValidation,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones y la política de privacidad.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

export const businessSignupSchema = z.object({
  companyName: z.string().min(1, { message: "El nombre de la empresa es requerido." }),
  legalRepName: z.string().min(1, { message: "El nombre del representante legal es requerido." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  rfc: z.string()
    .min(12, { message: "El RFC debe tener 12 o 13 caracteres." })
    .max(13, { message: "El RFC debe tener 12 o 13 caracteres." })
    .regex(/^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/, { message: "Formato de RFC inválido. Ejemplo: ABC123456A78." }),
  phone: z.string().min(10, { message: "El número de teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, "Solo se permiten números."),
  password: passwordValidation,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones y la política de privacidad.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});