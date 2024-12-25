import { useTranslations } from 'next-intl';
import Annoucments from '../../ui/posts/annoucments';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden text-3xl md:block">{t('announcements')}</h1>
      <Annoucments />
    </div>
  );
}
