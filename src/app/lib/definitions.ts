import { z } from 'zod';

export const SignupFormFirstStepSchema = (t: any) =>
  z
    .object({
      firstname: z
        .string()
        .min(1, { message: t('mustNotBeEmpty') })
        .trim(),
      lastname: z
        .string()
        .min(1, { message: t('mustNotBeEmpty') })
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

export const SignupFormThirdSchema = (t: any) =>
  z.object({
    companyName: z.string().min(1, { message: t('mustNotBeEmpty') }),
    nip: z.string().length(10, { message: t('nipIsNotValid', { length: 10 }) }),
    country: z.string().min(2, { message: t('selectCountry') }),
    postalCode: z.string().min(1, { message: t('mustNotBeEmpty') }),
    city: z.string().min(1, { message: t('mustNotBeEmpty') }),
    street: z.string().min(1, { message: t('mustNotBeEmpty') }),
  });

export interface ValidationErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  repeatEmail?: string;
  password?: string | string[];
  repeatPassword?: string;
  accountType?: string;
  companyName?: string;
  nip?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  street?: string;
  isStatuteAccepted?: string;
  [key: string]: string | string[] | undefined;
}

export interface SignupFormData {
  firstname?: string;
  lastname?: string;
  email?: string;
  repeatEmail?: string;
  password?: string;
  repeatPassword?: string;
  accountType?: AccountType;
  asCompany?: boolean;
  company: CompanyData;
  languages?: string[];
  isStatuteAccepted: boolean;
}

export interface CompanyData {
  companyName?: string;
  nip?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  street?: string;
}

export enum ButtonTypes {
  Primary,
  Secondary,
  Tertiary,
}

export enum AccountType {
  Carrier = 'carrier',
  Principal = 'principal',
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator',
}

export type SessionPayload = {
  userId?: string;
  role?: Role;
  expiresAt?: Date;
};
