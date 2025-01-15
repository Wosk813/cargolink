'use client';

import { Button } from '../button';
import Input from '../input';
import { useActionState } from 'react';
import { addErrand } from '../../lib/actions';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Select } from '../select';
import AddressSelect from '../address-select';
import { Address } from '../../lib/definitions';

export default function AddErrandForm() {
  const t = useTranslations('addPost');
  const [from, setFrom] = useState<Address>({
    countryId: 0,
    stateId: 0,
    cityId: 0,
  });
  const [to, setTo] = useState<Address>({
    countryId: 0,
    stateId: 0,
    cityId: 0,
  });

  const [state, action, pending] = useActionState(addErrand, undefined);

  return (
    <form action={action} className="flex flex-col gap-2 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-2">
          <p className="text-xl">{t('roadInfo')}</p>
          <p>{t('startingPoint')}</p>
          <div className="text-black">
            <AddressSelect onChange={setFrom} value={from} />
            {state?.errors?.from && (
              <div className="mt-1 text-sm text-red-500">{state?.errors?.from}</div>
            )}
          </div>

          <p>{t('endPoint')}</p>
          <div className="text-black">
            <AddressSelect onChange={setTo} value={to} />
            {state?.errors?.to && (
              <div className="mt-1 text-sm text-red-500">{state?.errors?.to}</div>
            )}
          </div>
          <Input required name="earliestAt" title={t('earliestAt')} type="datetime-local" />
          <Input required name="latestAt" title={t('latestAt')} type="datetime-local" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xl">{t('post')}</p>
            <Input required name="title" title={t('postTitle')} error={state?.errors?.title} />
            <Input name="desc" multiline title={t('postDesc')} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl">{t('carInfo')}</p>
            <div className="flex flex-col gap-2">
              <Select
                name="wareCategory"
                containerStytles="bg-slate-800"
                className="bg-slate-800"
                title={t('wareCategory')}
                options={[
                  { value: 'other', label: t('other') },
                  { value: 'electronics', label: t('electronics') },
                  { value: 'furniture', label: t('furniture') },
                  { value: 'food', label: t('food') },
                  { value: 'textiles', label: t('textiles') },
                  { value: 'construction', label: t('construction') },
                  { value: 'industrial', label: t('industrial') },
                  { value: 'chemicals', label: t('chemicals') },
                  { value: 'agriculture', label: t('agriculture') },
                  { value: 'fuel', label: t('fuel') },
                  { value: 'waste', label: t('waste') },
                  { value: 'automotive', label: t('automotive') },
                  { value: 'pharma', label: t('pharma') },
                  { value: 'metal', label: t('metal') },
                  { value: 'paper', label: t('paper') },
                  { value: 'plastics', label: t('plastics') },
                ]}
              />
              <Input
                required
                name="wareName"
                title={t('wareName')}
                error={state?.errors?.wareName}
              />
            </div>
            <div className="flex gap-2">
              <Input
                required
                type="number"
                name="wareWeight"
                title={t('wareWeight')}
                className="text-center text-xl"
                error={state?.errors?.wareWeight}
              />
              <Input
                required
                name="wareSize"
                title={t('wareSize')}
                className="text-center text-xl"
                error={state?.errors?.wareSize}
              />
              <Input
                required
                type="number"
                name="wareHeight"
                title={t('wareHeight')}
                className="text-center text-xl"
                error={state?.errors?.wareHeight}
              />
            </div>
            <Input multiline name="specialConditions" title={t('specialConditions')} />
            <p className="text-center text-sm">
              <span className="text-slate-400">{t('sizeInfo')}</span> {t('sizeInfoExample')}
            </p>
            <p className="text-center text-sm text-slate-400">{t('acceptInfoErrand')}</p>
          </div>
        </div>
      </div>
      <input type="hidden" name="from" value={JSON.stringify(from)} />
      <input type="hidden" name="to" value={JSON.stringify(to)} />
      <Button disabled={pending}>{t('addErrand')}</Button>
    </form>
  );
}
