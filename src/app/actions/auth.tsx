'use server';

import { SignupFormSchema, FormState } from '../lib/definitions';
import { getTranslations } from 'next-intl/server';

export async function signup(state: FormState, formData: FormData) {
  const t = await getTranslations('signup');
  const validatedFields = SignupFormSchema(t).safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    repeatEmail: formData.get('repeatEmail'),
    password: formData.get('password'),
    repeatPassword: formData.get('repeatPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Call the provider or db to create a user...
}
