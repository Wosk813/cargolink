'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import 'react-country-state-city/dist/react-country-state-city.css';
import Input from '../../input';
import InputRadio from '../../inputRadio';
import { Button } from '../../button';

interface CityAddress {
  countryId: number;
  stateId: number;
  countryName: string;
  city: string;
}

interface FormState {
  principal: {
    isCompany: boolean;
    address: CityAddress;
    companyDetails?: {
      name: string;
      taxId: string;
      address: CityAddress;
      street: string;
    };
  };
  carrier: {
    isCompany: boolean;
    address: CityAddress;
    companyDetails?: {
      name: string;
      taxId: string;
      address: CityAddress;
      street: string;
    };
  };
  route: {
    from: CityAddress;
    to: CityAddress;
    showChangeForm: boolean;
    earliestTime: Date;
    latestTime: Date;
  };
  cargo: {
    category: string;
    name: string;
    weight: string;
    dimensions: string;
    height: string;
  };
}

const AddressSelect = ({
  value,
  onChange,
  label,
}: {
  value: CityAddress;
  onChange: (address: CityAddress) => void;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-slate-400">{label}</p>}
      <div className="flex gap-2 text-black">
        <CountrySelect
          required
          className="w-full"
          onChange={(e) => {
            e = e as Country;
            onChange({
              ...value,
              countryId: e.id,
              countryName: e.name,
              stateId: 0,
              city: '',
            });
          }}
          placeHolder="Wybierz kraj"
          region="Europe"
        />
        <StateSelect
          required
          countryid={value.countryId}
          onChange={(e) => {
            e = e as State;
            onChange({
              ...value,
              stateId: e.id,
              city: '',
            });
          }}
          placeHolder="Wybierz stan"
        />
        <CitySelect
          required
          countryid={value.countryId}
          stateid={value.stateId}
          onChange={(e) => {
            e = e as City;
            onChange({
              ...value,
              city: e.name,
            });
          }}
          placeHolder="Wybierz miasto"
        />
      </div>
    </div>
  );
};

const CompanyForm = ({
  value,
  onChange,
}: {
  value: NonNullable<FormState['principal']['companyDetails']>;
  onChange: (details: NonNullable<FormState['principal']['companyDetails']>) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        title="Pełna nazwa firmy"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <Input
        title="NIP"
        value={value.taxId}
        onChange={(e) => onChange({ ...value, taxId: e.target.value })}
      />
      <AddressSelect
        value={value.address}
        onChange={(address) => onChange({ ...value, address })}
      />
      <Input
        title="Ulica"
        value={value.street}
        onChange={(e) => onChange({ ...value, street: e.target.value })}
      />
    </div>
  );
};

const RouteDisplay = ({
  from,
  to,
  showChange,
  onChangeClick,
}: {
  from: CityAddress;
  to: CityAddress;
  showChange: boolean;
  onChangeClick: () => void;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <p>Informacje o trasie</p>
      <button className="text-yellow-300" onClick={onChangeClick}>
        <u>Zmień</u>
      </button>
    </div>
    <div className="flex justify-between rounded-md bg-slate-700 p-2">
      <div className="flex flex-col">
        <p className="text-sm text-slate-400">z</p>
        <h2 className="text-xl">{`${from.countryName}, ${from.city}`}</h2>
      </div>
      <ArrowRightIcon className="w-8 text-slate-400" />
      <div className="flex flex-col">
        <p className="text-sm text-slate-400">do</p>
        <h2 className="text-xl">{`${to.countryName}, ${to.city}`}</h2>
      </div>
    </div>
  </div>
);

export default function ContractForm() {
  const [formState, setFormState] = useState<FormState>({
    principal: {
      isCompany: false,
      address: { countryId: 0, stateId: 0, countryName: '', city: '' },
    },
    carrier: {
      isCompany: true,
      address: { countryId: 0, stateId: 0, countryName: '', city: '' },
    },
    route: {
      from: { countryId: 0, stateId: 0, countryName: '', city: '' },
      to: { countryId: 0, stateId: 0, countryName: '', city: '' },
      showChangeForm: false,
      earliestTime: new Date(Date.now()),
      latestTime: new Date(Date.now()),
    },
    cargo: {
      category: '',
      name: '',
      weight: '',
      dimensions: '',
      height: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Walidacja i wysyłka formularza
    console.log(formState);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <p>Zleceniodawca</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, isCompany: false },
              }))
            }
            title="Jako osoba fizyczna"
            name="principalEntityType"
            checked={!formState.principal.isCompany}
          />
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, isCompany: true },
              }))
            }
            title="Jako działalność gospodarcza"
            name="principalEntityType"
            checked={formState.principal.isCompany}
          />
        </div>

        {formState.principal.isCompany ? (
          <CompanyForm
            value={
              formState.principal.companyDetails ?? {
                name: '',
                taxId: '',
                address: { countryId: 0, stateId: 0, countryName: '', city: '' },
                street: '',
              }
            }
            onChange={(details) =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, companyDetails: details },
              }))
            }
          />
        ) : (
          <AddressSelect
            value={formState.principal.address}
            onChange={(address) =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, address },
              }))
            }
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p>Przewoźnik</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, isCompany: false },
              }))
            }
            title="Jako osoba fizyczna"
            name="carrierEntityType"
            checked={!formState.carrier.isCompany}
          />
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, isCompany: true },
              }))
            }
            title="Jako działalność gospodarcza"
            name="carrierEntityType"
            checked={formState.carrier.isCompany}
          />
        </div>

        {formState.carrier.isCompany ? (
          <CompanyForm
            value={
              formState.carrier.companyDetails ?? {
                name: '',
                taxId: '',
                address: { countryId: 0, stateId: 0, countryName: '', city: '' },
                street: '',
              }
            }
            onChange={(details) =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, companyDetails: details },
              }))
            }
          />
        ) : (
          <AddressSelect
            value={formState.carrier.address}
            onChange={(address) =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, address },
              }))
            }
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p>Przedmiot umowy</p>
        <Input
          title="Kategoria"
          value={formState.cargo.category}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              cargo: { ...prev.cargo, category: e.target.value },
            }))
          }
        />
        <Input
          title="Nazwa towaru"
          value={formState.cargo.name}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              cargo: { ...prev.cargo, name: e.target.value },
            }))
          }
        />
        <div className="flex gap-2">
          <Input
            title="Waga towaru"
            value={formState.cargo.weight}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                cargo: { ...prev.cargo, weight: e.target.value },
              }))
            }
          />
          <Input
            title="Wymiary towaru"
            value={formState.cargo.dimensions}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                cargo: { ...prev.cargo, dimensions: e.target.value },
              }))
            }
          />
          <Input
            title="Wysokość towaru"
            value={formState.cargo.height}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                cargo: { ...prev.cargo, height: e.target.value },
              }))
            }
          />
        </div>
      </div>

      <RouteDisplay
        from={formState.route.from}
        to={formState.route.to}
        showChange={formState.route.showChangeForm}
        onChangeClick={() =>
          setFormState((prev) => ({
            ...prev,
            route: { ...prev.route, showChangeForm: !prev.route.showChangeForm },
          }))
        }
      />

      {formState.route.showChangeForm && (
        <div className="flex justify-between rounded-md bg-slate-700 p-2">
          <AddressSelect
            value={formState.route.from}
            onChange={(from) =>
              setFormState((prev) => ({
                ...prev,
                route: { ...prev.route, from },
              }))
            }
            label="Z"
          />
          <AddressSelect
            value={formState.route.to}
            onChange={(to) =>
              setFormState((prev) => ({
                ...prev,
                route: { ...prev.route, to },
              }))
            }
            label="Do"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          title="Najwcześniej o"
          type="datetime-local"
          value={formState.route.earliestTime.toISOString()}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              route: { ...prev.route, earliestTime: e.target.value as unknown as Date },
            }))
          }
        />
        <Input
          title="Najpóźniej o"
          type="datetime-local"
          value={formState.route.latestTime.toISOString()}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              route: { ...prev.route, latestTime: e.target.value as unknown as Date },
            }))
          }
        />
      </div>

      <Button type="submit">Wyślij propozycje umowy</Button>
    </form>
  );
}
