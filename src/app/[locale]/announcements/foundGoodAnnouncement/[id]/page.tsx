import { Link } from '@/src/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const annoucementId = (await params).id;
  const t = await getTranslations('addPost');
  return (
    <div className="flex flex-col gap-4">
      <p className="text-slate-400">{t('foundGoodAnnouncement')}</p>
      <Link
        className="w-fit rounded-md bg-yellow-300 p-2 text-black"
        href={`/announcements/${annoucementId}`}
      >
        {t('goToAnnouncement')}
      </Link>
    </div>
  );
}
