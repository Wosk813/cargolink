import { z } from 'zod';

export const SignupFormSchema = (t: any) =>
  z
    .object({
      firstname: z
        .string()
        .min(2, { message: t('firstname') + ' ' + t('atLeastLength', { min: 2 }) })
        .trim(),
      lastname: z
        .string()
        .min(2, { message: t('lastname') + ' ' + t('atLeastLength', { min: 2 }) })
        .trim(),
      email: z
        .string()
        .email({ message: t('enterValidEmail') })
        .trim(),
      repeatEmail: z.string(),
      password: z
        .string()
        .min(5, { message: t('password') + ' ' + t('atLeastLength', { min: 5 }) })
        .regex(/[a-zA-Z]/, { message: t('atLeastLetter') })
        .regex(/[0-9]/, { message: t('atLeastNumber') })
        .trim(),
      repeatPassword: z.string(),
    })
    .superRefine(({ repeatEmail, email }, ctx) => {
      if (repeatEmail !== email) {
        ctx.addIssue({
          code: 'custom',
          message: t('emailDontMatch'),
          path: ['repeatEmail'],
        });
      }
    })
    .superRefine(({ repeatPassword, password }, ctx) => {
      if (repeatPassword !== password) {
        ctx.addIssue({
          code: 'custom',
          message: t('passwordDontMatch'),
          path: ['repeatPassword'],
        });
      }
    });

export type FormState =
  | {
      errors?: {
        firstname?: string[];
        lastname?: string[];
        email?: string[];
        repeatEmail?: string[];
        password?: string[];
        repeatPassword?: string[];
      };
      message?: string;
    }
  | undefined;
