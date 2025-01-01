'use client';

import { Button } from '../button';
import Input from '../input';
import { useActionState } from 'react';
import { addErrand } from '../../lib/actions';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useState } from 'react';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import { useTranslations } from 'next-intl';
import { Select } from '../select';

export default function AddErrandForm() {
  const t = useTranslations('addPost');
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [state, action, pending] = useActionState(addErrand, undefined);
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
          <Input required name="earliesAt" title="Najwcześniej wyjazd o" type="datetime-local" />
          <Input required name="latestAt" title="Najpóźniej wyjazd o" type="datetime-local" />
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
              <Input required name="wareName" title="Nazwa" error={state?.errors?.wareName} />
            </div>
            <div className="flex gap-2">
              <Input
                required
                type="number"
                name="wareWeight"
                title={t('maxWeight')}
                className="text-center text-xl"
                error={state?.errors?.wareWeight}
              />
              <Input
                required
                name="wareSize"
                title={t('maxSize')}
                className="text-center text-xl"
                error={state?.errors?.wareSize}
              />
              <Input
                required
                type="number"
                name="wareHeight"
                title={t('maxHeight')}
                className="text-center text-xl"
                error={state?.errors?.wareHeight}
              />
            </div>
            <Input multiline name="specialConditions" title="Specjalne warunki (niewymagane)" />
            <p className="text-center text-sm">
              <span className="text-slate-400">{t('sizeInfo')}</span> {t('sizeInfoExample')}
            </p>
            <p className="text-center text-sm text-slate-400">{t('acceptInfo')}</p>
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
