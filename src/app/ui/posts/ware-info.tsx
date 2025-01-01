import { getTranslations } from 'next-intl/server';
import { formatWeight } from './annoucment';
import { GoodsCategory } from '../../lib/definitions';
import { headers } from 'next/headers';

type CarInfoProps = {
  category: GoodsCategory | undefined;
  name: string | undefined;
  weight: number | undefined;
  size: { x: number | undefined; y: number | undefined; height: number | undefined } | undefined;
};

export default async function WareInfo({ category, name, weight, size }: CarInfoProps) {
  const t = await getTranslations('posts');
  return (
    <div className="rounded-md bg-slate-700 p-2">
      <div className="flex flex-col gap-2">
        <p className="text-xl">{t('wareInfo')}</p>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('wareCategory')}</p>
            <p>{t(category)}</p>
          </div>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('wareName')}</p>
            <p>{name}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumWeight')}</p>
            <p className="text-center text-xl">{formatWeight(weight)}</p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumSize')}</p>
            <p className="text-center text-xl">
              {size?.x}x{size?.y}
            </p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumHeight')}</p>
            <p className="text-center text-xl">{size?.height} cm</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          {t('sizeInfo')} <span className="text-white">(120x80cm)</span>
        </p>
      </div>
    </div>
  );
}
