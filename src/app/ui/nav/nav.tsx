"use client";

import BottomButtons from "./bottom-buttons";
import NavLinks from "./nav-links";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPath = pathname.split("/").pop();

  const handleOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        data-testid="side-menu"
        className={`
          ${isMenuOpen ? "fixed" : "hidden"} 
          md:flex flex flex-col w-64 h-dvh text-white px-6 
          bg-slate-800 z-50
        `}
      >
        <h1 className="text-4xl text-center font-bold py-8">CargoLink</h1>
        <div>
          <NavLinks />
        </div>
        <div className="mt-auto">
          <BottomButtons />
        </div>
      </div>

      <div
        data-testid="page-title"
        className="flex md:hidden w-full text-white text-4xl py-8 px-5 justify-between font-bold"
      >
        <p>{t(currentPath)}</p>
        <Bars3Icon
          data-testid="menu-button"
          onClick={handleOpenMenu}
          className="w-10 text-white"
        />
      </div>

      {isMenuOpen && (
        <div
          data-testid="menu-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
