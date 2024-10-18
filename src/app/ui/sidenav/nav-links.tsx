import { Link } from "@/src/i18n/routing";
import { useTranslations } from "next-intl";

export default function NavLinks() {
  const t = useTranslations("nav");

  const links = [
    {
      name: t("announcements"),
      href: "/announcements",
    },
    {
      name: t("errands"),
      href: "/errands",
    },
    {
      name: t("searchUser"),
      href: "/search/user",
    },
  ];

  return (
    <>
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href}>
            <p className="bg-slate-700 py-2 px-2 my-4 text-center rounded-md">
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
