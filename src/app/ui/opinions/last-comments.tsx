'use client';

import { useTranslations } from 'use-intl';
import { ButtonTypes, Opinion } from '../../lib/definitions';
import { Button } from '../button';
import OpinionCard from './opinion';
import { useState } from 'react';

export default function LastComments({ opinions }: { opinions: Opinion[] }) {
  const t = useTranslations('opinions');
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      {opinions.length > 0 && (
        <>
          {(showAll ? opinions : opinions.slice(0, 3)).map((opinion: Opinion) => (
            <OpinionCard key={opinion.id} opinion={opinion} />
          ))}
          {opinions.length > 3 && !showAll && (
            <Button
              className="!bg-slate-800 font-normal text-white"
              buttType={ButtonTypes.Tertiary}
              onClick={() => setShowAll(true)}
            >
              {t('showMore')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
