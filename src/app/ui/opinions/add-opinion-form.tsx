'use client';

import { useActionState, useState } from 'react';
import { AccountType, User } from '../../lib/definitions';
import { StarIcon as EmptyStar } from '@heroicons/react/24/outline';
import { StarIcon as FullStar } from '@heroicons/react/24/solid';
import Input from '../input';
import { Button } from '../button';
import { addOpinion } from '../../lib/actions';
import { useTranslations } from 'next-intl';

export default function AddOpinionForm({ user }: { user: User }) {
  const [stars, setStars] = useState<0 | 1 | 2 | 3 | 4 | 5>(1);
  const [state, handleSubmit, pending] = useActionState(addOpinion, undefined);
  const t = useTranslations('opinions');

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2 rounded-md bg-slate-700 p-2">
        <p className="text-sm text-slate-400">
          {user.accountType == AccountType.Carrier ? t('carrier') : t('principal')}
        </p>
        {`${user.firstname} ${user.lastname}`}
      </div>
      <div className="flex w-full flex-col gap-2 rounded-md bg-slate-700 p-2">
        <p className="text-sm text-slate-400">{t('yourMark')}</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((num) =>
            num <= stars ? (
              <FullStar
                key={num}
                style={{ height: `36px` }}
                className="cursor-pointer text-yellow-300"
                onClick={() => setStars(num as 1 | 2 | 3 | 4 | 5)}
              />
            ) : (
              <EmptyStar
                key={num}
                style={{ height: `36px` }}
                className="cursor-pointer"
                onClick={() => setStars(num as 1 | 2 | 3 | 4 | 5)}
              />
            ),
          )}
        </div>
      </div>
      <Input name="desc" title={t('yourComment')} multiline />
      <input type="hidden" name="stars" value={stars} />
      <input type="hidden" name="forUserId" value={user.id as string} />
      <Button disabled={pending} type="submit">
        {t('addOpinion')}
      </Button>
    </form>
  );
}
