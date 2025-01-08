'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Input from '../../input';
import { Button } from '../../button';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useState } from 'react';

type CityAddres = {
  countryId: number;
  stateId: number;
  city: string;
};

export default function ContractForm() {
  const [principalCity, setPrincipalCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    city: '',
  });
  const [principalCompanyCity, setPrincipalCompanyCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    city: '',
  });

  const [carrierCity, setCarrierCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    city: '',
  });

  const [carrierCompanyCity, setCarrierCompanyCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    city: '',
  });

  const [principalAsCompany, setPrincipalAsCompany] = useState(true);
  const [carrierAsCompany, setCarrierAsCompany] = useState(true);

  function CompanyAddres() {
    return (
      <div className="flex flex-col gap-2">
        <Input title="Pełna nazwa firmy" />
        <Input title="NIP" />
        <div className="flex gap-2 text-black">
          <div className="w-full">
            <CountrySelect
              required
              className="w-full"
              onChange={(e) => {
                e = e as Country;
                setPrincipalCompanyCity((prev) => ({
                  ...prev,
                  countryId: e.id,
                  stateId: 0,
                  city: '',
                }));
              }}
              placeHolder="Wybierz kraj"
              region={'Europe'}
            />
          </div>
          <div className="w-full">
            <StateSelect
              required
              countryid={principalCompanyCity.countryId}
              onChange={(e) => {
                e = e as State;
                setPrincipalCompanyCity((prev) => ({
                  ...prev,
                  stateId: e.id,
                  city: '',
                }));
              }}
              placeHolder="Wybierz stan"
            />
          </div>
          <div className="w-full">
            <CitySelect
              required
              name="fromCity"
              countryid={principalCompanyCity.countryId}
              stateid={principalCompanyCity.stateId}
              onChange={(e) => {
                e = e as City;
                setPrincipalCity((prev) => ({
                  ...prev,
                  city: e.name,
                }));
              }}
              placeHolder="Wybierz miasto"
            />
          </div>
        </div>
      </div>
    );
  }

  function PhisicalPersonAddres() {
    return (
      <div className="flex flex-col gap-2">
        <Input title="Imię i nazwisko" />
        <div className="flex gap-2">
          <Input title="Kraj" />
          <Input title="Miasto" />
          <Input title="Ulica" />
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4">
      {principalCity.city}
      <div className="flex flex-col gap-2">
        <p>Zleceniodawca</p>
        {principalAsCompany && <CompanyAddres />}
        {!principalAsCompany && <PhisicalPersonAddres />}
      </div>

      <div className="flex flex-col gap-2">
        <p>Przewoźnik</p>
        {carrierAsCompany && <CompanyAddres />}
        {!carrierAsCompany && <PhisicalPersonAddres />}
      </div>
      <div className="flex flex-col gap-2">
        <p>Przedmiot umowy</p>
        <Input title="Kategoria" />
        <Input title="Nazwa towaru" />
        <div className="flex gap-2">
          <Input title="Waga towaru" />
          <Input title="Wymiary towaru" />
          <Input title="Wysokość towaru" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>Informacje o trasie</p>
        <div className="flex justify-between rounded-md bg-slate-700 p-2">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">z</p>
            <h2 className="text-xl">Wrocław</h2>
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">do</p>
            <h2 className="text-xl">Berlin</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Input title="Najwcześniej o" />
          <Input title="Najpóźniej o" />
        </div>
      </div>
      <Button type="submit">Wyślij propozycje umowy</Button>
    </form>
  );
}
