'use client'
import { signup } from "../../actions/auth";
import { Input } from "../input";
import { Button } from "../button";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from 'react-dom'
import { useActionState } from "react";

export function SignupForm() {
  const [state, formAction] = useActionState(signup, undefined)
  const t = useTranslations("signup");
  const { pending } = useFormStatus()
  
  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Input name="firstname" title={t("firstname")} />
      {state?.errors?.firstname && <p>{state.errors.firstname}</p>}
      <Input name="lastname" title={t("lastname")} />
      {state?.errors?.lastname && <p>{state.errors.lastname}</p>}
      <Input name="email" type="email" title="E-mail" />
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <Input name="repeatEmail" type="email" title={t("repeatEmail")} />
      {state?.errors?.repeatEmail && <p>{state.errors.repeatEmail}</p>}
      <Input name="password" type="password" title={t("password")} />
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <Input name="repeatPassword" type="password" title={t("repeatPassword")} />
      {state?.errors?.repeatPassword && <p>{state.errors.repeatPassword}</p>}
      <Button disabled={pending} type="submit">{t("next")}</Button>
    </form>
  );
}