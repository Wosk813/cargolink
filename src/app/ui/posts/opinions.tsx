import { StarIcon as FullStar } from '@heroicons/react/24/solid';
import { Button } from '@/src/app/ui/button';
import { ButtonTypes } from '@/src/app/lib/definitions';
import { StarIcon as EmptyStar } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';

export default async function Opinions() {
  const t = await getTranslations('opinions');
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-slate-700 p-2">
        <div className="flex flex-col gap-2">
          <p className="text-xl">{t('opinions')}</p>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('carrier')}</p>
            <p className="text-xl">Marcin Kowalski</p>
          </div>
          <div className="flex flex-col rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">{t('avgRate')}</p>
            <p className="text-3xl">4.6</p>
            <div className="flex">
              <FullStar className="h-10 text-yellow-300" />
              <FullStar className="h-10 text-yellow-300" />
              <FullStar className="h-10 text-yellow-300" />
              <FullStar className="h-10 text-yellow-300" />
              <EmptyStar className="h-10" />
            </div>
          </div>
          <Button
            className="border-yellow-300 bg-slate-800 text-yellow-300"
            buttType={ButtonTypes.Secondary}
          >
            {t('goToProfile')}
          </Button>
          <p className="text-xl">{t('lastComments')}</p>
          <div className="flex flex-col gap-2 rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">2 tyg. temu</p>
            <p>Grzegorz Barys</p>
            <div className="flex">
              <FullStar className="h-6 text-yellow-300" />
              <FullStar className="h-6 text-yellow-300" />
              <FullStar className="h-6 text-yellow-300" />
              <FullStar className="h-6 text-yellow-300" />
              <FullStar className="h-6 text-yellow-300" />
            </div>
            <p>Kierowca bezkonfliktowy, punktualny. Nie mam żadnych zastrzeżeń</p>
          </div>
          <div className="flex flex-col gap-2 rounded-md bg-slate-800 p-2">
            <p className="text-sm text-slate-400">1 mies. temu</p>
            <p>Andrzej Gaweł</p>
            <div className="flex">
              <FullStar className="h-6 text-yellow-300" />
              <FullStar className="h-6 text-yellow-300" />
              <EmptyStar className="h-6" />
              <EmptyStar className="h-6" />
              <EmptyStar className="h-6" />
            </div>
            <p>Przewoźnik wjeżdżając do zakładu, przypadkowo zarysował mi brame. Poza tym ok</p>
          </div>
          <Button className="!bg-slate-800 font-normal text-white" buttType={ButtonTypes.Tertiary}>
            {t('showMore')}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-slate-700 p-2">
        <p className="text-xl">{t('contact')}</p>
        <Button>{t('goToChat')}</Button>
      </div>
    </div>
  );
}
