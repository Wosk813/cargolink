'use client';

import { useState } from 'react';
import 'react-country-state-city/dist/react-country-state-city.css';
import Input from '../../input';
import InputRadio from '../../inputRadio';
import { Button } from '../../button';
import { AnnouncementProps, ContractFormState, ErrandProps } from '@/src/app/lib/definitions';
import AddressSelect from './address-select';
import Route from './route';
import CompanyForm from './company-form';
import PhisicalPersonForm from './phisical-person-form';

export default function ContractForm({ post }: { post: AnnouncementProps | ErrandProps }) {
  const [formState, setFormState] = useState<ContractFormState>({
    principal: {
      isCompany: false,
      companyDetails: {
        address: { countryId: 0, stateId: 0, countryName: '', city: '' },
        taxId: '',
        name: '',
      },
      personDetails: {
        name: '',
        address: { countryId: 0, stateId: 0, countryName: '', city: '' },
      },
    },
    carrier: {
      isCompany: true,
      companyDetails: {
        address: { countryId: 0, stateId: 0, countryName: '', city: '' },
        taxId: '',
        name: '',
      },
      personDetails: {
        name: '',
        address: { countryId: 0, stateId: 0, countryName: '', city: '' },
      },
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
    },
  });

  return (
    <form className="flex flex-col gap-4">
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
          <PhisicalPersonForm
            value={
              formState.principal.personDetails ?? {
                name: '',
                address: { countryId: 0, stateId: 0, countryName: '', city: '' },
              }
            }
            onChange={(details) =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, personDetails: details },
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
          <PhisicalPersonForm
            value={
              formState.carrier.personDetails ?? {
                name: '',
                address: { countryId: 0, stateId: 0, countryName: '', city: '' },
              }
            }
            onChange={(details) =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, personDetails: details },
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
      </div>

      <Route
        from={formState.route.from}
        to={formState.route.to}
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
          title="Data wyjazdu"
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
          title="Data przyjazdu"
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
