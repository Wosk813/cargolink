import { z } from 'zod';

const inRange = (min: number, max: number) => (value: number) => value >= min && value <= max;

export const newErrandSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    wareWeight: z.coerce
      .number()
      .refine(inRange(1, 50_000), { message: t('valueBetween') + ' 1 - 50 000' }),
    wareSize: z.string().regex(/^[1-9][0-9]*x[1-9][0-9]*$/, {
      message: t('formatIssue'),
    }),
    wareHeight: z.coerce
      .number()
      .refine(inRange(1, 1_000), { message: t('valueBetween') + ' 1 - 1000' }),
    fromCity: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    toCity: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    desc: z.string().trim(),
    earliestAt: z.coerce.date(),
    latestAt: z.coerce.date(),
    fromLatitude: z.coerce.number(),
    fromLongitude: z.coerce.number(),
    toLatitude: z.coerce.number(),
    toLongitude: z.coerce.number(),
    wareName: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    category: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    specialConditions: z.string(),
  });

export type NewErrandFormState =
  | {
      errors?: {
        title?: string[];
        wareName?: string[];
        wareWeight?: string[];
        wareSize?: string[];
        wareHeight?: string[];
        fromCity?: string[];
        toCity?: string[];
        earliestAt?: string[];
        latestAt?: string[];
        category?: string[];
      };
      message?: string;
    }
  | undefined;

export const newAnnouncementSchema = (t: any) =>
  z.object({
    title: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    brand: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    model: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    maxWeight: z.coerce
      .number()
      .refine(inRange(1, 50_000), { message: t('valueBetween') + ' 1 - 50 000' }),
    maxSize: z.string().regex(/^[1-9][0-9]*x[1-9][0-9]*$/, {
      message: t('formatIssue'),
    }),
    maxHeight: z.coerce
      .number()
      .refine(inRange(1, 1_000), { message: t('valueBetween') + ' 1 - 1000' }),
    fromCity: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    toCity: z
      .string()
      .min(1, { message: t('mustNotBeEmpty') })
      .trim(),
    desc: z.string().trim(),
    departureDate: z.coerce.date(),
    arrivalDate: z.coerce.date(),
    fromLatitude: z.coerce.number(),
    fromLongitude: z.coerce.number(),
    toLatitude: z.coerce.number(),
    toLongitude: z.coerce.number(),
  });

export type NewAnnouncementFormState =
  | {
      errors?: {
        title?: string[];
        brand?: string[];
        model?: string[];
        maxWeight?: string[];
        maxSize?: string[];
        maxHeight?: string[];
        fromCity?: string[];
        toCity?: string[];
        departureDate?: string[];
        arrivalDate?: string[];
      };
      message?: string;
    }
  | undefined;

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
  accountType?: AccountType;
};

export type AnnoucementProps = {
  id?: string;
  title: string;
  fromCity?: string;
  toCity?: string;
  fromGeography?: GeoPoint;
  toGeography?: GeoPoint;
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
  desc?: string;
  roadColor?: string;
};

export type ErrandProps = {
  id?: string;
  title: string;
  fromCity: string;
  toCity: string;
  fromGeography?: GeoPoint;
  toGeography?: GeoPoint;
  earliestAt: Date;
  latestAt: Date;
  ware: {
    category: GoodsCategory;
    name: string;
    weight: number;
    size: {
      x: number;
      y: number;
      height: number;
    };
    specialConditions?: string;
  };
  desc?: string;
  isAccepted?: boolean;
  authorId?: string;
  roadColor?: string;
};

export enum GoodsCategory {
  Electronics = 'electronics',
  Furniture = 'furniture',
  Food = 'food',
  Other = 'other',
  All = 'all',
  Textiles = 'textiles',
  Construction = 'construction',
  Industrial = 'industrial',
  Chemicals = 'chemicals',
  Agriculture = 'agriculture',
  Fuel = 'fuel',
  Waste = 'waste',
  Automotive = 'automotive',
  Pharma = 'pharma',
  Metal = 'metal',
  Paper = 'paper',
  Plastics = 'plastics',
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

export type User = {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  role: Role | null;
  accountType: AccountType | null;
  lastSeen: Date | null;
  createdAt: Date | null;
  companyId: string | null;
  languages: string[] | null;
  userDesc: string | null;
  isPhisicalPerson: boolean | null;
};

export type GeoPoint = {
  type: string;
  coordinates: [number, number];
};

export type Road = {
  from?: GeoPoint | undefined;
  to?: GeoPoint | undefined;
  postId?: string | undefined;
  color?: string | undefined;
};
