import { SignupForm } from "@/src/app/ui/auth/signup-form";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations('signup')
  return (
    <div className="md:bg-slate-800 h-full px-12 py-8 w-full md:w-4/12 md:justify-center flex flex-col gap-6">
      <h1 className="text-5xl font-bold md:text-center">{t("joinUs")}</h1>
      <SignupForm />
    </div>
  );
}
