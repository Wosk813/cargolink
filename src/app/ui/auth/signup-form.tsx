'use client';

import { signup } from '../../actions/auth';
import { Input } from '../input';
import { Button } from '../button';
import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

export function SignupForm() {
  const [state, formAction] = useActionState(signup, undefined);
  const t = useTranslations('signup');
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Input name="firstname" title={t('firstname')} error={state?.errors?.firstname} />
      <Input name="lastname" title={t('lastname')} error={state?.errors?.lastname} />
      <Input name="email" type="email" title="E-mail" error={state?.errors?.email} />
      <Input
        name="repeatEmail"
        type="email"
        title={t('repeatEmail')}
        error={state?.errors?.repeatEmail}
      />
      <Input
        name="password"
        type="password"
        title={t('password')}
        error={
          state?.errors?.password && (
            <div>
              <ul>
                {state.errors.password.map((error) => (
                  <li className='text-sm text-red-500' key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )
        }
      />
      <Input
        name="repeatPassword"
        type="password"
        title={t('repeatPassword')}
        error={state?.errors?.repeatPassword}
      />
      <Button disabled={pending} type="submit">
        {t('next')}
      </Button>
    </form>
  );
}
