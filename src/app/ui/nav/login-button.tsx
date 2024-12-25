'use client';

import { Link } from '@/src/i18n/routing';
import { Button } from '../button';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

type LoginButtonProps = {
  onLogout: () => Promise<void>;
  isAuth: boolean;
};

export default function LoginButton({ onLogout, isAuth }: LoginButtonProps) {
  const currentLocale = useLocale();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await onLogout();
    } finally {
      setPending(false);
    }
  };
  const t = useTranslations('nav');
  if (isAuth) {
    return (
      <Button
        onClick={handleLogout}
        className="my-4 w-full rounded-md !bg-slate-700 px-2 py-2 text-center font-normal text-white"
        disabled={pending}
      >
        {t('logout')}
      </Button>
    );
  } else {
    return (
      <Link href={`/auth/login`} className="w-full">
        <p className="my-4 w-full rounded-md bg-slate-700 px-2 py-2 text-center">{t('login')}</p>
      </Link>
    );
  }
}
