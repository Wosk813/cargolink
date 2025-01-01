import AllRoadsMap from '@/src/app/ui/posts/all-roads-map';
import { Link } from '@/src/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('nav');
  return (
    <div className="h-full bg-red-200">
      <AllRoadsMap postType="errands" />
      <Link
        className="block w-full rounded-md bg-slate-600 p-4 text-center text-xl"
        href={'/announcements'}
      >
        {t('close')}
      </Link>
    </div>
  );
}
