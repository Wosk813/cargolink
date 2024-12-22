'use client';

import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';

type NavLinksProps = {
  links: Array<{ name: string; href: string }>;
  handleMenuOpen: () => void;
};

export default function NavLinks({ links, handleMenuOpen }: NavLinksProps) {
  const t = useTranslations('nav');

  return (
    <>
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href} onClick={handleMenuOpen}>
            <p className="my-4 rounded-md bg-slate-700 px-2 py-2 text-center">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
