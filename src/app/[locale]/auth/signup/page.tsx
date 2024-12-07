import { SignupForm } from '@/src/app/ui/auth/signup-form';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('signup');
  return (
    <div className="flex h-full w-full flex-col gap-6 bg-slate-800 px-24 py-8 md:w-6/12 md:justify-center">
      <h1 className="text-3xl font-bold md:text-center">{t('joinUs')}</h1>
      <SignupForm />
    </div>
  );
}