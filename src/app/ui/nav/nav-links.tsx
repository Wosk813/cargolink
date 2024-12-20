import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';
import { verifySession } from '../../lib/dal';

export default async function NavLinks() {
  const t = useTranslations('nav');
  const { isAuth } = await verifySession();

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

  if (isAuth) {
    links.push({
      name: t('profile'),
      href: '/profile',
    });
  }

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
