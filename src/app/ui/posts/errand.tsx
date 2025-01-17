import { useTranslations } from 'next-intl';
import { ErrandProps } from '../../lib/definitions';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { FormattedDate, formatWeight } from './annoucment';
import { Button } from '../button';
import { acceptErrand, deleteErrand } from '../../lib/actions';

export default function Errand({
  id,
  title,
  from,
  to,
  earliestAt,
  latestAt,
  ware,
  showModeratorButtons,
}: ErrandProps) {
  const t = useTranslations('posts');

  return (
    <div className="display flex flex-col gap-2 rounded-md bg-slate-700 p-4 md:gap-4">
      <h1 className="rounded-md bg-slate-800 p-2 text-xl">{title}</h1>
      <div className="flex justify-between rounded-md bg-slate-800 p-4">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">{t('fromCity')}</p>
          <h2 className="text-xl">{from?.countryIso2 + ', ' + from?.city}</h2>
        </div>
        <ArrowRightIcon className="w-8 text-slate-400" />
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">{t('to')}</p>
          <h2 className="text-xl">{to?.countryIso2 + ', ' + to?.city}</h2>
        </div>
      </div>
      <div className="flex gap-2 md:gap-4">
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">{t('plannedDepartureDate')}</p>
          <FormattedDate date={new Date(earliestAt)} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">{t('plannedArrivalDate')}</p>
          <FormattedDate date={new Date(latestAt)} />
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-md bg-slate-800 p-4">
        <p className="text-sm text-slate-400">Kategoria</p>
        <h2 className="text-2xl">{t(ware.category)}</h2>
        <p className="text-sm text-slate-400">Nazwa towaru</p>
        <h2 className="text-2xl">{ware.name}</h2>
      </div>
      <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">{t('maximumWeight')}</p>
          <p className="text-center text-xl md:text-2xl">{formatWeight(ware.weight)}</p>
        </div>
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">{t('maximumSize')}</p>
          <p className="text-center text-xl md:text-2xl">
            {ware.size.x}x{ware.size.y}
          </p>
        </div>
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">{t('maximumHeight')}</p>
          <p className="text-center text-xl md:text-2xl">{ware.size.height} cm</p>
        </div>
      </div>
      {showModeratorButtons && (
        <div className="flex flex-col gap-4">
          <Button onClick={() => acceptErrand(id!)} className="bg-lime-300">
            Zatwierdź
          </Button>
          <Button onClick={() => deleteErrand(id!)} className="bg-red-500 text-white">
            Usuń
          </Button>
        </div>
      )}
    </div>
  );
}
