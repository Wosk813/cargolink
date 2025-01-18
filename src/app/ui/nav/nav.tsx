'use client';

import BottomButtons from './bottom-buttons';
import NavLinks from './nav-links';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Role } from '../../lib/definitions';

type ClientNavigationProps = {
  links: Array<{ name: string; href: string; highlighted: boolean }>;
  onLogout: () => Promise<void>;
  isAuth: boolean;
  role: Role;
};

export default function Nav({ links, onLogout, isAuth, role }: ClientNavigationProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = pathname.split('/')[2];

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickLink = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        data-testid="side-menu"
        className={` ${isMenuOpen ? 'fixed' : 'hidden'} z-50 flex h-dvh w-64 flex-col bg-slate-800 px-6 text-white md:flex`}
      >
        <h1 className="py-8 text-center text-4xl font-bold">CargoLink</h1>

        <div>
          <NavLinks links={links} handleClickLink={handleClickLink} />
        </div>
        <div className="mt-auto">
          {role && role != Role.User && (
            <p className="text-sm text-slate-400">{role.toUpperCase()}</p>
          )}
          <BottomButtons onLogout={onLogout} isAuth={isAuth} />
        </div>
      </div>

      <div
        data-testid="page-title"
        className="flex w-full justify-between px-5 py-8 text-4xl font-bold text-white md:hidden"
      >
        <p>{t(currentPath)}</p>
        <Bars3Icon data-testid="menu-button" onClick={handleOpenMenu} className="w-10 text-white" />
      </div>

      {isMenuOpen && (
        <div
          data-testid="menu-overlay"
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
