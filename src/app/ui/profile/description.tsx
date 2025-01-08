'use client';
import Input from '../input';
import { Button } from '../button';
import { useState } from 'react';
import { updateDescription } from '../../lib/actions';
import { useTranslations } from 'next-intl';

export default function Description({
  desc,
  userId,
  enabled,
}: {
  desc: string | null;
  userId: string;
  enabled: boolean;
}) {
  const [saveHidden, setSaveHidden] = useState(true);
  const [description, setDescription] = useState(desc);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations('profile');

  if (enabled) {
    return (
      <div>
        <Input
          title={t('userDesc')}
          onChange={(e) => {
            setDescription(e.target.value);
            setSaveHidden(false);
          }}
          value={description as string}
        />
        <Button
          onClick={async () => {
            setIsPending(true);
            await updateDescription(userId, description as string);
            setIsPending(false);
            location.reload();
          }}
          className={`${saveHidden ? 'hidden' : 'block'}`}
          disabled={isPending}
        >
          {t('saveChanges')}
        </Button>
      </div>
    );
  } else {
    return (
      <div className="rounded-md bg-slate-700 p-2">
        <p className="text-sm text-slate-400">Opis użytkownika</p>
        {description ? description : t('noDesc')}
      </div>
    );
  }
}
