import { Link } from '@/src/i18n/routing';
import { Button } from '../button';
import { useLocale, useTranslations } from 'next-intl';

type LoginButtonProps = {
  onLogout: () => Promise<void>;
  isAuth: boolean;
};

export default function LoginButton({ onLogout, isAuth }: LoginButtonProps) {
  const currentLocale = useLocale();
  const t = useTranslations('nav');
  if (isAuth) {
    return (
      <Button
        onClick={onLogout}
        className="my-4 w-full rounded-md !bg-slate-700 px-2 py-2 text-center font-normal text-white"
      >
        Wyloguj
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
