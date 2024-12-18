import LoginForm from '@/src/app/ui/auth/login-form';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export default function Page() {
  const t = useTranslations('login');
  return (
    <div className="flex h-full w-full flex-col justify-between px-4 py-4 md:w-6/12 md:justify-center md:gap-12 md:bg-slate-800 md:px-8">
      <div className="flex flex-col gap-12">
        <h1 className="text-5xl font-bold md:text-7xl">CargoLink</h1>
        <p className="text-xl md:text-slate-400">
          Dołącz do nas i uprość swoje procesy logistyczne. CargoLink – Twój niezawodny partner w
          świecie transportu!
        </p>
      </div>
      <div className={'w-full rounded-2xl bg-slate-800 p-6 md:p-0'}>
        <LoginForm />
        <p className="hidden text-center md:block">{t('or')}</p>
        <Link
          href="/auth/signup"
          className="mt-2 block rounded-md border border-yellow-300 bg-slate-800 px-2 py-2 text-center"
        >
          <span className="text-white">{t('dontHaveAccount')}</span>{' '}
          <span className="text-yellow-300">{t('register')}</span>
        </Link>
      </div>
    </div>
  );
}
