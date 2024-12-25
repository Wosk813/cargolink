'use client';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/src/app/ui/posts/map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100">Ładowanie mapy...</div>,
});
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <div className="p-4">
      <Map center={[52.2297, 21.0122]} zoom={13} />
      <Link
        className="block w-full rounded-md bg-slate-600 p-4 text-center text-xl"
        href={'/announcements'}
      >
        {t('close')}
      </Link>
    </div>
  );
}
