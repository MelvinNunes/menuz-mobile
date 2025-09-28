import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'auth.validation.nameRequired')
      .min(2, 'auth.validation.nameMinLength'),
    email: z
      .string()
      .min(1, 'auth.validation.emailRequired')
      .email('auth.validation.emailInvalid'),
    password: z
      .string()
      .min(1, 'auth.validation.passwordRequired')
      .min(6, 'auth.validation.passwordMinLength'),
    confirmPassword: z
      .string()
      .min(1, 'auth.validation.confirmPasswordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.passwordsDoNotMatch',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
