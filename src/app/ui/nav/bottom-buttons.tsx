'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function BottomButtons() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex w-full gap-4">
      <div className="relative shrink-0">
        <select
          className="my-4 appearance-none rounded-md bg-slate-700 px-8 py-2 text-center"
          value={currentLocale}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="pl">PL</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
        </select>
        <GlobeAltIcon className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white" />
      </div>
      <Link href={`/${currentLocale}/auth/login`} className="w-full">
        <p className="my-4 w-full rounded-md bg-slate-700 px-2 py-2 text-center">{t('login')}</p>
      </Link>
    </div>
  );
}
