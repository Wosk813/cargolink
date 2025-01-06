import { Button } from '@/src/app/ui/button';
import { ButtonTypes, Opinion } from '@/src/app/lib/definitions';

import { getTranslations } from 'next-intl/server';
import { getOpinions, getUserById } from '../../lib/actions';
import Stars from './starts';
import OpinionCard from './opinion';
import Link from 'next/link';
import LastComments from './last-comments';

type OpinionsProps = {
  userId: string;
};

function calculateAverageStars(opinions: Opinion[]): number {
  const stars = opinions.filter((o) => o.stars).map((o) => o.stars!);

  if (stars.length === 0) return 0;

  const avg = stars.reduce((sum, curr) => sum + curr, 0) / stars.length;
  return Number(avg.toFixed(1));
}

export default async function Opinions({ userId }: OpinionsProps) {
  const user = await getUserById(userId);
  const opinions = await getOpinions(userId);
  const t = await getTranslations('opinions');
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-slate-700 p-2">
        <div className="flex flex-col gap-2">
          <p className="text-xl">{t('opinions')}</p>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('carrier')}</p>
            <p className="text-xl">{`${user.firstname} ${user.lastname}`}</p>
          </div>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('avgRate')}</p>
            <p className="text-3xl">
              {opinions.length > 0 ? calculateAverageStars(opinions) : 'Brak opinii'}
            </p>
            <Stars stars={Math.floor(calculateAverageStars(opinions)) as 0 | 1 | 2 | 3 | 4 | 5} />
          </div>
          <Link
            href={`/pl/profile/${userId}`} // TODO
            className="rounded-md border border-yellow-300 bg-slate-800 p-2 text-center text-yellow-300"
          >
            {t('goToProfile')}
          </Link>
          <p className="text-xl">{t('lastComments')}</p>
          <LastComments opinions={opinions} />
        </div>
      </div>
    </div>
  );
}
