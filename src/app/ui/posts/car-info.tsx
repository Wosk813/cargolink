import { getTranslations } from 'next-intl/server';
import { formatWeight } from './annoucment';

type CarInfoProps = {
  brand: string | undefined;
  model: string | undefined;
  maxWeight: number | undefined;
  maxSize: { x: number | undefined; y: number | undefined } | undefined;
  maxHeight: number | undefined;
};

export default async function CarInfo({
  brand,
  model,
  maxWeight,
  maxSize,
  maxHeight,
}: CarInfoProps) {
  const t = await getTranslations('posts');
  return (
    <div className="rounded-md bg-slate-700 p-2">
      <div className="flex flex-col gap-2">
        <p className="text-xl">{t('carInfo')}</p>
        <div className="flex justify-between rounded-md bg-slate-800 p-2">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">{t('brand')}</p>
            <p>{brand}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">{t('model')}</p>
            <p>{model}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumWeight')}</p>
            <p className="text-center text-xl">{formatWeight(maxWeight)}</p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumSize')}</p>
            <p className="text-center text-xl">
              {maxSize?.x}x{maxSize?.y}
            </p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">{t('maximumHeight')}</p>
            <p className="text-center text-xl">{maxHeight} cm</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          {t('sizeInfo')} <span className="text-white">(120x80cm)</span>
        </p>
      </div>
    </div>
  );
}
