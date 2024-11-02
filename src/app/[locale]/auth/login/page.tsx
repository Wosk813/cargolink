import LoginForm from "@/src/app/ui/auth/login-form";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";

export default function Page() {
  const t = useTranslations("login");
  return (
    <div className="md:bg-slate-800 h-full px-12 py-8 w-full md:w-6/12 md:justify-center flex flex-col gap-6">
      <h1 className="text-5xl font-bold md:text-center">CargoLink</h1>
      <p className="md:text-slate-400 text-xl">
        Dołącz do nas i uprość swoje procesy logistyczne. CargoLink – Twój
        niezawodny partner w świecie transportu!
      </p>
      <LoginForm />
      <p className="text-center">{t("or")}</p>
      <Link
        href="/auth/signup"
        className="bg-slate-800 border text-center border-yellow-300 rounded-md px-4 py-4"
      >
        <span className="text-white">{t("dontHaveAccount")}</span>{" "}
        <span className="text-yellow-300">{t("register")}</span>
      </Link>
    </div>
  );
}
