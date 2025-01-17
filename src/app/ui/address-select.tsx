import { Address } from '@/src/app/lib/definitions';
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  GetCountries,
  GetState,
  GetCity,
} from 'react-country-state-city';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import Input from './input';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function AddressSelect({
  value,
  onChange,
  label,
}: {
  value: Address;
  onChange: (address: Address) => void;
  label?: string;
}) {
  const t = useTranslations('addPost');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    const initializeSelections = async () => {
      if (value.countryId && !selectedCountry) {
        const countries = await GetCountries();
        const country = countries.find((c) => c.id === value.countryId);
        if (country) {
          setSelectedCountry(country);
        }
      }

      if (value.countryId && value.stateId && !selectedState) {
        const states = await GetState(value.countryId);
        const state = states.find((s) => s.id === value.stateId);
        if (state) {
          setSelectedState(state);
        }
      }

      if (value.countryId && value.stateId && value.cityId && !selectedCity) {
        const cities = await GetCity(value.countryId, value.stateId);
        const city = cities.find((c) => c.id === value.cityId);
        if (city) {
          setSelectedCity(city);
        }
      }
    };

    initializeSelections();
  }, [value.countryId, value.stateId, value.cityId]);

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-slate-400">{label}</p>}
      <div className="flex flex-col gap-2 text-black md:flex-row">
        <div className="w-full">
          <CountrySelect
            className="w-full"
            onChange={(e) => {
              e = e as Country;
              setSelectedCountry(e);
              setSelectedState(null);
              setSelectedCity(null);
              onChange({
                ...value,
                countryId: e.id,
                countryName: e.name,
                stateId: 0,
                cityId: 0,
                countryIso2: e.iso2,
                city: '',
              });
            }}
            value={selectedCountry?.id || value.countryId}
            placeHolder={t('chooseCountry')}
            region="Europe"
            defaultValue={selectedCountry as any}
          />
        </div>
        <div className="w-full">
          <StateSelect
            countryid={value.countryId}
            onChange={(e) => {
              e = e as State;
              setSelectedState(e);
              setSelectedCity(null);
              onChange({
                ...value,
                stateId: e.id,
                cityId: 0,
                city: '',
              });
            }}
            value={selectedState?.id || value.stateId}
            placeHolder={t('chooseState')}
            defaultValue={selectedState as any}
          />
        </div>
        <div className="w-full">
          <CitySelect
            countryid={value.countryId}
            stateid={value.stateId}
            onChange={(e) => {
              e = e as City;
              setSelectedCity(e);
              onChange({
                ...value,
                city: e.name,
                cityId: e.id,
                geography: { coordinates: [e.latitude, e.longitude] },
              });
            }}
            value={selectedCity?.id || value.cityId}
            placeHolder={t('chooseCity')}
            defaultValue={selectedCity as any}
          />
        </div>
        <Input
          title={t('postalCode')}
          value={value.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
        />
        <Input
          title={t('street')}
          value={value.street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
        />
      </div>
    </div>
  );
}
