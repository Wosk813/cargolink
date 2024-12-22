import 'server-only';

import { cookies } from 'next/headers';
import { decrypt } from '@/src/app/lib/session';
import { cache } from 'react';
import { redirect } from '@/src/i18n/routing';
import { Role } from './definitions';

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    console.log('No session found');
    return { isAuth: false, userId: '', role: undefined };
    // redirect({ href: '/auth/login', locale: 'pl' });
  }

  return { isAuth: true, userId: session?.userId, role: session?.role as Role };
});

// export const getUser = cache(async () => {
//   const session = await verifySession();
//   if (!session) return null;
//
//   try {
//     return getUserById(session.userId);
//   } catch (error) {
//     console.log('Failed to fetch user');
//     return null;
//   }
// });