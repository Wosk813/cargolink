'use client';

import { checkCredentials } from '../../lib/database';
import { Button } from '../button';
import { Input } from '../input';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

export default function LoginForm() {
  const t = useTranslations('login');
  const [state, handleLogin, pending] = useActionState(checkCredentials, { errors: '' });
  return (
    <form className="flex flex-col gap-4 text-black" action={handleLogin}>
      <Input type="email" error={state?.errors} name="email" title="E-mail" required />
      <Input type="password" error={state?.errors} name="password" title={t('password')} required />
      <Button className="mt-4" disabled={pending}>
        {t('login')}
      </Button>
    </form>
  );
}
