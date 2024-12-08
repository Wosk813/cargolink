import { useTranslations } from 'next-intl';
import SearchForm from '@/src/app/ui/search/searchForm';

export default function Page() {
  const t = useTranslations('search');
  return (
    <>
      <h1 className="hidden text-3xl md:block">{t('searchUser')}</h1>
      <SearchForm />
    </>
  );
}
