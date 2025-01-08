import { AccountType, Opinion } from '@/src/app/lib/definitions';
import { getTranslations } from 'next-intl/server';
import { getOpinions, getUserById } from '../../lib/actions';
import Stars from './starts';
import Link from 'next/link';
import LastComments from './last-comments';
import { Button } from '../button';
import { verifySession } from '../../lib/dal';

type OpinionsProps = {
  forUserId: string;
  onProfile?: boolean;
};

function calculateAverageStars(opinions: Opinion[]): number {
  const stars = opinions.filter((o) => o.stars).map((o) => o.stars!);

  if (stars.length === 0) return 0;

  const avg = stars.reduce((sum, curr) => sum + curr, 0) / stars.length;
  return Number(avg.toFixed(1));
}

export default async function Opinions({ forUserId, onProfile }: OpinionsProps) {
  const { userId } = await verifySession();
  const user = await getUserById(forUserId);
  const opinions = await getOpinions(forUserId);
  const t = await getTranslations('opinions');
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-slate-700 p-2">
        <div className="flex flex-col gap-2">
          <p className="text-xl">{t('opinions')}</p>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">
              {user.accountType == AccountType.Carrier ? t('carrier') : t('principal')}
            </p>
            <p className="text-xl">{`${user.firstname} ${user.lastname}`}</p>
          </div>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('avgRate')}</p>
            <p className={opinions.length > 0 ? 'text-3xl' : ''}>
              {opinions.length > 0 ? calculateAverageStars(opinions) : t('noOpinions')}
            </p>
            <Stars
              stars={Math.floor(calculateAverageStars(opinions)) as 0 | 1 | 2 | 3 | 4 | 5}
              height={48}
            />
          </div>
          {!onProfile && (
            <Link
              href={`/pl/profile/${forUserId}`} // TODO
              className="rounded-md border border-yellow-300 bg-slate-800 p-2 text-center text-yellow-300"
            >
              {t('goToProfile')}
            </Link>
          )}
          <p className="text-xl">{t('lastComments')}</p>
          <LastComments opinions={opinions} />
          {forUserId != userId && (
            <Link
              className="rounded-md bg-yellow-300 p-2 text-center text-black"
              href={`/pl/addOpinion/${forUserId}`}
            >
              {t('addOpinion')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
