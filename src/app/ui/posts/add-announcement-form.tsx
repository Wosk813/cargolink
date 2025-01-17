'use client';

import { Button } from '../button';
import Input from '../input';
import { useActionState } from 'react';
import { addAnnouncement } from '../../lib/actions';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Address } from '../../lib/definitions';
import AddressSelect from '../address-select';

export default function AddAnnoucementForm() {
  const t = useTranslations('addPost');
  const [from, setFrom] = useState<Address>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
    cityId: 0,
    countryIso2: '',
  });
  const [to, setTo] = useState<Address>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
    cityId: 0,
    countryIso2: '',
  });

  const [state, action, pending] = useActionState(addAnnouncement, undefined);

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
          <Input
            required
            name="departureDate"
            title={t('departureDateAndTime')}
            type="datetime-local"
          />
          <p>{t('endPoint')}</p>
          <div className="text-black">
            <AddressSelect onChange={setTo} value={to} />
            {state?.errors?.to && (
              <div className="mt-1 text-sm text-red-500">{state?.errors?.to}</div>
            )}
          </div>
          <Input
            required
            name="arrivalDate"
            title={t('arrivalDateAndTime')}
            type="datetime-local"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xl">{t('post')}</p>
            <Input required name="title" title={t('postTitle')} error={state?.errors?.title} />
            <Input name="desc" multiline title={t('postDesc')} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl">{t('carInfo')}</p>
            <div className="flex gap-2">
              <Input required name="brand" title={t('brand')} error={state?.errors?.brand} />
              <Input required name="model" title={t('model')} error={state?.errors?.model} />
            </div>
            <div className="flex gap-2">
              <Input
                required
                type="number"
                name="maxWeight"
                title={t('maxWeight')}
                className="text-center text-xl"
                error={state?.errors?.maxWeight}
              />
              <Input
                required
                name="maxSize"
                title={t('maxSize')}
                className="text-center text-xl"
                error={state?.errors?.maxSize}
              />
              <Input
                required
                type="number"
                name="maxHeight"
                title={t('maxHeight')}
                className="text-center text-xl"
                error={state?.errors?.maxHeight}
              />
            </div>
            <p className="text-center text-sm">
              <span className="text-slate-400">{t('sizeInfo')}</span> {t('sizeInfoExample')}
            </p>
            <p className="text-center text-sm text-slate-400">{t('acceptInfoAnnouncement')}</p>
          </div>
        </div>
      </div>
      <input type="hidden" name="from" value={JSON.stringify(from)} />
      <input type="hidden" name="to" value={JSON.stringify(to)} />
      <Button disabled={pending}>{t('addAnnoucement')}</Button>
    </form>
  );
}
