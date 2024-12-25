import { FormattedDate } from '@/src/app/ui/posts/annoucment';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

type RoadDetailsProps = {
  from: string | undefined;
  to: string | undefined;
  departureDate: Date | undefined;
  arrivalDate: Date | undefined;
};

export default async function RoadDetails({
  from,
  to,
  departureDate,
  arrivalDate,
}: RoadDetailsProps) {
  const t = await getTranslations('posts');
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-700 p-2">
      <p className="text-xl">Szczegóły trasy</p>
      <div className="flex justify-between rounded-md bg-slate-800 p-2">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">z</p>
          <h2 className="text-xl">{from}</h2>
        </div>
        <ArrowRightIcon className="w-8 text-slate-400" />
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">do</p>
          <h2 className="text-xl">{to}</h2>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-2">
          <p className="text-sm text-slate-400">{t('plannedDepartureDate')}</p>
          <FormattedDate date={departureDate} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-2">
          <p className="text-sm text-slate-400">{t('plannedDepartureDate')}</p>
          <FormattedDate date={arrivalDate} />
        </div>
      </div>
    </div>
  );
}
