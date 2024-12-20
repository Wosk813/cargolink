'use server';

import { checkCredentials, getUserByEmail } from './database';
import { createSession } from './session';
import { redirect } from '@/src/i18n/routing';

export async function handleLogin(state: { errors: string } | undefined, formData: FormData) {
  const credentialsErrors = await checkCredentials(formData);
  if (credentialsErrors?.errors) {
    return { errors: credentialsErrors.errors };
  }
  const user = await getUserByEmail(formData.get('email') as string);
  await createSession(user['user_id']);
  redirect({ href: '/announcements', locale: 'pl' });
}
