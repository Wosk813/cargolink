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
  Normal,
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

export type AnnoucementProps = {
  id?: string;
  title: string;
  fromCity?: string;
  toCity?: string;
  fromGeography?: string;
  toGeography?: string;
  departureDate: Date;
  arrivalDate: Date;
  carProps: {
    maxWeight: number;
    maxSize: { x: number; y: number; height: number };
    brand?: string;
    model?: string;
  };
  authorId?: string;
  isAccepted?: boolean;
};

export enum GoodsCategory {
  Electronics = 'electronics',
  Furniture = 'furniture',
  Food = 'food',
  Other = 'other',
}

export enum SortDirection {
  ByNewest = 'byNewest',
  ByOldest = 'byOldest',
  ByWeightAsc = 'ByWeightAsc',
  ByWeightDesc = 'ByWeightDesc',
  BySizeAsc = 'BySizeAsc',
  BySizeDesc = 'BySizeDesc',
  ByHeightAsc = 'ByHeightAsc',
  ByHeightDesc = 'ByHeightDesc',
}

export type FilterProps = {
  date: {
    departureDate: {
      from: Date | null;
      to: Date | null;
    };
    arrivalDate: {
      from: Date | null;
      to: Date | null;
    };
  };
  cities: {
    from: string | null;
    to: string | null;
  };
  goods: {
    weight: {
      from: number | null;
      to: number | null;
    };
    size: {
      x: {
        from: number | null;
        to: number | null;
      };
      y: {
        from: number | null;
        to: number | null;
      };
      height: {
        from: number | null;
        to: number | null;
      };
    };
    category?: GoodsCategory;
  };
};
