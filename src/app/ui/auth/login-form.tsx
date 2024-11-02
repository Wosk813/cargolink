"use client";

import { Button } from "../button";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("login")

  return (
    <form className="text-black">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <Button>{t('login')}</Button>
    </form>
  );
}
