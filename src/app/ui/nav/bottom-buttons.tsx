'use client'

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function BottomButtons() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-4 w-full">
      <div className="relative shrink-0">
        <select
          className="appearance-none bg-slate-700 py-2 px-8 my-4 text-center rounded-md"
          value={currentLocale}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="pl">PL</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
        </select>
        <GlobeAltIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
      </div>
      <Link href={`/${currentLocale}/login`} className="w-full">
        <p className="bg-slate-700 py-2 px-2 my-4 text-center rounded-md w-full">
          {t("login")}
        </p>
      </Link>
    </div>
  );
}
