import { useTranslations } from 'next-intl';
import Annoucments from '../../ui/annoucements/annoucments';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="hidden text-3xl md:block">{t('announcements')}</h1>
      <Annoucments />
    </div>
  );
}
