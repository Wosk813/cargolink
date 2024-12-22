import { useTranslations } from 'next-intl';
import AnnoucmentsHeader from '../../ui/annoucements/annoucments-header';
import AnnoucmentsWrapper from '../../ui/annoucements/annoucements-wrapper';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden text-3xl md:block">{t('announcements')}</h1>
      <AnnoucmentsHeader />
      <AnnoucmentsWrapper />
    </div>
  );
}
