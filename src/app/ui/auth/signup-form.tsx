'use client'

import { signup } from "@/src/actions/auth";
import { Input } from "../input";
import { Button } from "../button";
import { useTranslations } from "next-intl";

export function SignupForm() {
  const t = useTranslations("signup");
  return (
    <form action={signup} className="flex flex-col gap-6">
      <Input title={t("firstname")} />
      <Input title={t("lastname")} />
      <Input title="E-mail" />
      <Input title={t("repeatEmail")} />
      <Input title={t("password")} />
      <Input title={t("repeatPassword")} />
      <Button type="submit">{t("next")}</Button>
    </form>
  );
}
