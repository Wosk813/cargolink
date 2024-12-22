'use server';

import { checkCredentials } from '@/src/app/lib/actions';

export async function handleLogin(formData: FormData): Promise<void> {
  await login(formData);

  // @ts-ignore
  // redirect('/announcements');
}

export async function login(formData: FormData): Promise<void> {
  const user = { email: formData.get('email'), password: formData.get('password') };
  const credentialsCheck = await checkCredentials(user.email as string, user.password as string);
  console.log(credentialsCheck);
}

export async function logout(): Promise<void> {}

export async function getSession(): Promise<string> {
  return '';
}
