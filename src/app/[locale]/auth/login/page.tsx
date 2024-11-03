import LoginForm from '@/src/app/ui/auth/login-form';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export default function Page() {
  const t = useTranslations('login');
  return (
    <div className="flex h-full w-full flex-col gap-6 px-12 py-8 md:w-6/12 md:justify-center md:bg-slate-800">
      <h1 className="text-5xl font-bold md:text-center">CargoLink</h1>
      <p className="md:text-slate-400">
        Dołącz do nas i uprość swoje procesy logistyczne. CargoLink – Twój niezawodny partner w
        świecie transportu!
      </p>
      <LoginForm />
      <p className="text-center">{t('or')}</p>
      <Link
        href="/auth/signup"
        className="rounded-md border border-yellow-300 bg-slate-800 px-2 py-2 text-center"
      >
        <span className="text-white">{t('dontHaveAccount')}</span>{' '}
        <span className="text-yellow-300">{t('register')}</span>
      </Link>
    </div>
  );
}
