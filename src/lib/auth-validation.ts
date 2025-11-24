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

export const personalSignupSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es requerido." }),
  lastName: z.string().min(1, { message: "El apellido es requerido." }),
  phone: z.string().min(10, { message: "El número de teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, "Solo se permiten números."),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: passwordValidation,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones y la política de privacidad.',
  }),
});

export const businessSignupSchema = z.object({
  companyName: z.string().min(1, { message: "El nombre de la empresa es requerido." }),
  legalRepName: z.string().min(1, { message: "El nombre del representante legal es requerido." }),
  email: z.string().email({ message: "Correo electrónico inválido." }),
  rfc: z.string()
    .min(12, { message: "El RFC debe tener entre 12 y 13 caracteres." })
    .max(13, { message: "El RFC debe tener entre 12 y 13 caracteres." }),
  phone: z.string().min(10, { message: "El número de teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, "Solo se permiten números."),
  password: passwordValidation,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones y la política de privacidad.',
  }),
});