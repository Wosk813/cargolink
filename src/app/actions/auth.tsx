'use server'

import { SignupFormSchema, FormState } from "../lib/definitions";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    repeatEmail: formData.get("repeatEmail"),
    password: formData.get("password"),
    repeatPassword: formData.get("repeatPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...
}