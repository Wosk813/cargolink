'use client';

import { FormattedDate } from '@/src/app/ui/posts/annoucment';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/src/app/ui/posts/map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100">Ładowanie mapy...</div>,
});
import { useTranslations } from 'next-intl';
import { GeoPoint } from '../../lib/definitions';

type RoadDetailsProps = {
  from: string | undefined;
  to: string | undefined;
  earliestAt: Date | undefined;
  latestAt: Date | undefined;
  className?: string;
  fromGeography?: GeoPoint | undefined;
  toGeography?: GeoPoint | undefined;
  postId?: string | undefined;
  roadColor?: string | undefined;
};

export default function ErrandRoadDetails({
  from,
  to,
  earliestAt,
  latestAt,
  className,
  fromGeography,
  toGeography,
  postId,
  roadColor,
}: RoadDetailsProps) {
  const t = useTranslations('posts');
  return (
    <div className={`${className} flex flex-col gap-2 rounded-md bg-slate-700 p-2`}>
      <p className="text-xl">{t('roadDetails')}</p>
      <div className="flex justify-between rounded-md bg-slate-800 p-2">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">{t('fromCity')}</p>
          <h2 className="text-xl">{from}</h2>
        </div>
        <ArrowRightIcon className="w-8 text-slate-400" />
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">{t('to')}</p>
          <h2 className="text-xl">{to}</h2>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-2">
          <p className="text-sm text-slate-400">{t('earliestAt')}</p>
          <FormattedDate date={earliestAt} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-2">
          <p className="text-sm text-slate-400">{t('latestAt')}</p>
          <FormattedDate date={latestAt} />
        </div>
      </div>
      <Map
        className="!h-64 rounded-md"
        roads={[{ from: fromGeography, to: toGeography, postId: postId, color: roadColor }]}
        zoom={5}
      />
    </div>
  );
}
