import { useTranslations } from 'next-intl';
import Errands from '../../ui/posts/errands';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden text-3xl md:block">{t('announcements')}</h1>
      <Errands />
    </div>
  );
}
