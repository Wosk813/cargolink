'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Input from '../../input';
import { Button } from '../../button';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useState } from 'react';
import InputRadio from '../../inputRadio';
import { AccountType } from '@/src/app/lib/definitions';

type CityAddres = {
  countryId: number;
  stateId: number;
  countryName: string;
  city: string;
};

export default function ContractForm() {
  const [principalCity, setPrincipalCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });
  const [principalCompanyCity, setPrincipalCompanyCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });

  const [carrierCity, setCarrierCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });

  const [carrierCompanyCity, setCarrierCompanyCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });

  const [principalAsCompany, setPrincipalAsCompany] = useState(false);
  const [carrierAsCompany, setCarrierAsCompany] = useState(true);

  const [road, setRoad] = useState<{ fromCity: string; toCity: string }>({
    fromCity: '',
    toCity: '',
  });

  const [showChangeRoad, setShowChangeRoad] = useState(false);

  const [fromCity, setFromCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });
  const [toCity, setToCity] = useState<CityAddres>({
    countryId: 0,
    stateId: 0,
    countryName: '',
    city: '',
  });

  function CompanyAddres({ accountType }: { accountType: AccountType }) {
    return (
      <div className="flex flex-col gap-2">
        <Input title="Pełna nazwa firmy" />
        <Input title="NIP" />
        <div className="flex flex-col gap-2 text-black md:flex-row">
          <div className="w-full">
            <CountrySelect
              required
              className="w-full"
              onChange={(e) => {
                e = e as Country;
                accountType == AccountType.Principal
                  ? setPrincipalCompanyCity((prev) => ({
                      ...prev,
                      countryId: e.id,
                      stateId: 0,
                      city: '',
                    }))
                  : setCarrierCompanyCity((prev) => ({
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
              countryid={
                accountType == AccountType.Principal
                  ? principalCompanyCity.countryId
                  : carrierCompanyCity.countryId
              }
              onChange={(e) => {
                e = e as State;
                accountType == AccountType.Principal
                  ? setPrincipalCompanyCity((prev) => ({
                      ...prev,
                      stateId: e.id,
                      city: '',
                    }))
                  : setCarrierCompanyCity((prev) => ({
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
              countryid={
                accountType == AccountType.Principal
                  ? principalCompanyCity.countryId
                  : carrierCompanyCity.countryId
              }
              stateid={
                accountType == AccountType.Principal
                  ? principalCompanyCity.stateId
                  : carrierCompanyCity.stateId
              }
              onChange={(e) => {
                e = e as City;
                accountType == AccountType.Principal
                  ? setPrincipalCity((prev) => ({
                      ...prev,
                      city: e.name,
                    }))
                  : setCarrierCity((prev) => ({
                      ...prev,
                      city: e.name,
                    }));
              }}
              placeHolder="Wybierz miasto"
            />
          </div>
          <Input title="Ulica" />
        </div>
      </div>
    );
  }

  function PhisicalPersonAddres() {
    return (
      <div className="flex flex-col gap-2">
        <Input title="Imię i nazwisko" />
        <div className="flex gap-2 text-black">
          <div className="w-full">
            <CountrySelect
              required
              className="w-full"
              onChange={(e) => {
                e = e as Country;
                setFromCity((prev) => ({
                  ...prev,
                  countryId: e.id,
                  countryName: e.name,
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
              countryid={fromCity.countryId}
              onChange={(e) => {
                e = e as State;
                setFromCity((prev) => ({
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
              countryid={fromCity.countryId}
              stateid={fromCity.stateId}
              onChange={(e) => {
                e = e as City;
                setFromCity((prev) => ({
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

  function ChangeRoad() {
    return (
      <div className="flex justify-between rounded-md bg-slate-700 p-2">
        <div className="flex flex-col gap-2 text-black">
          <p className="text-slate-400">Z</p>
          <CountrySelect
            required
            className="w-full"
            onChange={(e) => {
              e = e as Country;
              setFromCity((prev) => ({
                ...prev,
                countryId: e.id,
                countryName: e.name,
                stateId: 0,
                city: '',
              }));
            }}
            placeHolder="Wybierz kraj"
            region={'Europe'}
          />
          <StateSelect
            required
            countryid={fromCity.countryId}
            onChange={(e) => {
              e = e as State;
              setFromCity((prev) => ({
                ...prev,
                stateId: e.id,
                city: '',
              }));
            }}
            placeHolder="Wybierz stan"
          />
          <CitySelect
            required
            name="fromCity"
            countryid={fromCity.countryId}
            stateid={fromCity.stateId}
            onChange={(e) => {
              e = e as City;
              setFromCity((prev) => ({
                ...prev,
                city: e.name,
              }));
            }}
            placeHolder="Wybierz miasto"
          />
        </div>
        <div className="flex flex-col gap-2 text-black">
          <p className="text-slate-400">Do</p>
          <CountrySelect
            required
            className="w-full"
            onChange={(e) => {
              e = e as Country;
              setToCity((prev) => ({
                ...prev,
                countryId: e.id,
                countryName: e.name,
                stateId: 0,
                city: '',
              }));
            }}
            placeHolder="Wybierz kraj"
            region={'Europe'}
          />
          <StateSelect
            required
            countryid={toCity.countryId}
            onChange={(e) => {
              e = e as State;
              setToCity((prev) => ({
                ...prev,
                stateId: e.id,
                city: '',
              }));
            }}
            placeHolder="Wybierz stan"
          />
          <CitySelect
            required
            name="fromCity"
            countryid={toCity.countryId}
            stateid={toCity.stateId}
            onChange={(e) => {
              e = e as City;
              setToCity((prev) => ({
                ...prev,
                city: e.name,
              }));
            }}
            placeHolder="Wybierz miasto"
          />
        </div>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4">
      {principalCity.city}
      <div className="flex flex-col gap-2">
        <p>Zleceniodawca</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() => setPrincipalAsCompany(false)}
            title="Jako osoba fizyczna"
            name="principalEntityType"
            checked={!principalAsCompany}
          />
          <InputRadio
            onChange={() => setPrincipalAsCompany(true)}
            title="Jako działalność gospodarcza"
            name="principalEntityType"
            checked={principalAsCompany}
          />
        </div>
        {principalAsCompany && <CompanyAddres accountType={AccountType.Principal} />}
        {!principalAsCompany && <PhisicalPersonAddres />}
      </div>

      <div className="flex flex-col gap-2">
        <p>Przewoźnik</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() => setCarrierAsCompany(false)}
            title="Jako osoba fizyczna"
            name="carrierEntityType"
            checked={!carrierAsCompany}
          />
          <InputRadio
            onChange={() => setCarrierAsCompany(true)}
            title="Jako działalność gospodarcza"
            name="carrierEntityType"
            checked={carrierAsCompany}
          />
        </div>
        {carrierAsCompany && <CompanyAddres accountType={AccountType.Carrier} />}
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
        <div className="flex items-center gap-2">
          <p>Informacje o trasie</p>
          <button className="text-yellow-300" onClick={() => setShowChangeRoad(!showChangeRoad)}>
            <u>Zmień</u>
          </button>
        </div>
        <div className="flex justify-between rounded-md bg-slate-700 p-2">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">z</p>
            <h2 className="text-xl">{`${fromCity.countryName}, ${fromCity.city}`}</h2>
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">do</p>
            <h2 className="text-xl">{`${toCity.countryName}, ${toCity.city}`}</h2>
          </div>
        </div>
        {showChangeRoad && <ChangeRoad />}
        <div className="flex flex-col gap-2 md:flex-row">
          <Input title="Najwcześniej o" type="datetime-local" />
          <Input title="Najpóźniej o" type="datetime-local" />
        </div>
      </div>
      <Button type="submit">Wyślij propozycje umowy</Button>
    </form>
  );
}
