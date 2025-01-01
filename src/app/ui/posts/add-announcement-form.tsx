'use client';

import { Button } from '../button';
import Input from '../input';
import { useActionState } from 'react';
import { addAnnouncement } from '../../lib/actions';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useState } from 'react';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import { useTranslations } from 'next-intl';

export default function AddAnnoucementForm() {
  const t = useTranslations('addPost');
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [state, action, pending] = useActionState(addAnnouncement, undefined);
  const [fromCoordinates, setFromCoordinates] = useState({ lat: '', lng: '' });
  const [toCoordinates, setToCoordinates] = useState({ lat: '', lng: '' });

  return (
    <form action={action} className="flex flex-col gap-2 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-2">
          <p className="text-xl">{t('roadInfo')}</p>
          <p>{t('startingPoint')}</p>
          <div className="text-black">
            <CountrySelect
              required
              className="bg-black"
              onChange={(e) => {
                e = e as Country;
                setCountryid(e.id);
              }}
              placeHolder={t('selectCountry')}
              region={'Europe'}
            />
            <StateSelect
              required
              countryid={countryid}
              onChange={(e) => {
                e = e as State;
                setstateid(e.id);
              }}
              placeHolder={t('selectState')}
            />
            <CitySelect
              required
              name="fromCity"
              countryid={countryid}
              stateid={stateid}
              onChange={(e) => {
                e = e as City;
                setFromCoordinates({ lat: e.latitude, lng: e.longitude });
              }}
              placeHolder={t('selectCity')}
            />
            {state?.errors?.fromCity && (
              <div className="mt-1 text-sm text-red-500">{state?.errors?.fromCity}</div>
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
            <CountrySelect
              required
              className="bg-black"
              onChange={(e) => {
                e = e as Country;
                setCountryid(e.id);
              }}
              placeHolder={t('selectCountry')}
              region={'Europe'}
            />
            <StateSelect
              required
              countryid={countryid}
              onChange={(e) => {
                e = e as State;
                setstateid(e.id);
              }}
              placeHolder={t('selectState')}
            />
            <CitySelect
              required
              name="toCity"
              countryid={countryid}
              stateid={stateid}
              onChange={(e) => {
                e = e as City;
                setToCoordinates({ lat: e.latitude, lng: e.longitude });
              }}
              placeHolder={t('selectCity')}
            />
            {state?.errors?.toCity && (
              <div className="mt-1 text-sm text-red-500">{state?.errors?.toCity}</div>
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
      <input type="hidden" name="fromLatitude" value={fromCoordinates.lat} />
      <input type="hidden" name="fromLongitude" value={fromCoordinates.lng} />
      <input type="hidden" name="toLatitude" value={toCoordinates.lat} />
      <input type="hidden" name="toLongitude" value={toCoordinates.lng} />
      <Button disabled={pending}>{t('addAnnoucement')}</Button>
    </form>
  );
}
