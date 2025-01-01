import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';

export default function MapButt({ postType }: { postType: 'announcements' | 'errands' }) {
  const t = useTranslations('posts');
  return (
    <div>
      <Link
        href={`/${postType}/map`}
        className="block w-full rounded-md border-2 border-yellow-300 p-1 text-center text-xl text-yellow-300"
      >
        {t('openMap')}
      </Link>
    </div>
  );
}
