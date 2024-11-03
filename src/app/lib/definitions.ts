import { z } from "zod";

export const SignupFormSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "Firstname must be at least 2 characters long." })
    .trim(),
  lastname: z
    .string()
    .min(2, { message: "Lastname must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  repeatEmail: z.string().email().trim(),
  password: z
    .string()
    .min(5, { message: "Be at least 5 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .trim(),
  repeatPassword: z
    .string()
}).superRefine(({ repeatEmail, email }, ctx) => {
  if (repeatEmail !== email) {
    ctx.addIssue({
      code: "custom",
      message: "The email did not match",
      path: ['repeatEmail']
    });
  }
}).superRefine(({ repeatPassword, password }, ctx) => {
  if (repeatPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The password did not match",
      path: ['repeatPassword']
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
