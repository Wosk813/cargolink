import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NavLinks() {
  const t = useTranslations('nav');

  const links = [
    {
      name: t('announcements'),
      href: '/announcements',
    },
    {
      name: t('errands'),
      href: '/errands',
    },
    {
      name: t('searchUser'),
      href: '/search/searchUser',
    },
  ];

  return (
    <>
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href}>
            <p className="my-4 rounded-md bg-slate-700 px-2 py-2 text-center">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
