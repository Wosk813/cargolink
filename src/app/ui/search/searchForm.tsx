'use client';

import Input from '../input';
import { Button } from '../button';
import { searchUsers } from '../../lib/actions';
import { useActionState } from 'react';
import { Select } from '../select';
import { useTranslations } from 'next-intl';
import { User } from '../../lib/definitions';
import { Link } from '@/src/i18n/routing';

export default function SearchForm() {
  const [state, formAction, pending] = useActionState<User[], FormData>(searchUsers, []);
  const t = useTranslations('search');
  return (
    <div className="flex flex-col md:flex-row">
      <form action={formAction} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Input name="firstName" title={t('firstname')} />
          <Input name="lastName" title={t('lastname')} />
          <Input name="email" title="E-mail" />
          <Select
            name="accountType"
            className="bg-slate-800"
            title={t('accountType')}
            options={[
              { value: 'carrier', label: t('carrier') },
              { value: 'principal', label: t('principal') },
            ]}
          />
          <Button type="submit" disabled={pending}>
            <p>{t('search')}</p>
          </Button>
        </div>
      </form>
      <div className="w-full md:px-4">
        <p className="text-center">{t('resultsCount', { count: state.length })}</p>
        <ul className="flex flex-col gap-2">
          {state?.map((user: User) => (
            <li key={user.id}>
              <Link
                href={`/profile/${user.id}`}
                className="flex w-full justify-between rounded-md bg-slate-700 p-2"
              >
                <p className="text-lg">
                  {user.firstname} {user.lastname}
                </p>
                <span>{t(user.accountType)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
