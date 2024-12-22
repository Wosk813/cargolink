import { useTranslations } from 'next-intl';
import AnnoucmentsWrapper from '../../ui/annoucements/annoucments-wrapper';

export default function Page() {
  const t = useTranslations('nav');
  return (
    <>
      <h1 className="hidden text-3xl md:block">{t('announcements')}</h1>
      <AnnoucmentsWrapper />
    </>
  );
}
