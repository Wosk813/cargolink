'use client';

import { useState, useTransition } from 'react';
import 'react-country-state-city/dist/react-country-state-city.css';
import Input from '../../input';
import InputRadio from '../../inputRadio';
import { Button } from '../../button';
import { ContractFormState, Post } from '@/src/app/lib/definitions';
import AddressSelect from './address-select';
import Road from './road';
import CompanyForm from './company-form';
import PhisicalPersonForm from './phisical-person-form';
import { Select } from '../../select';
import { useTranslations } from 'next-intl';

export default function ContractForm({ post }: { post: Post }) {
  const t = useTranslations('addPost');
  const [formState, setFormState] = useState<ContractFormState>({
    principal: {
      isCompany: post.principal?.isCompany!,
      companyDetails: {
        address: post.principal?.companyDetails?.address!,
        taxId: post.principal?.companyDetails?.taxId!,
        name: post.principal?.companyDetails?.companyName!,
      },
      personDetails: {
        name: post.principal?.personDetails?.name!,
        address: { countryId: 0, stateId: 0, cityId: 0, countryName: '', city: '' },
      },
    },
    carrier: {
      isCompany: post.carrier?.isCompany!,
      companyDetails: {
        address: post.carrier?.companyDetails?.address!,
        taxId: post.carrier?.companyDetails?.taxId!,
        name: post.carrier?.companyDetails?.companyName!,
      },
      personDetails: {
        name: post.carrier?.personDetails?.name!,
        address: { countryId: 0, stateId: 0, cityId: 0, countryName: '', city: '' },
      },
    },
    route: {
      from: post.road?.from!,
      to: post.road?.to!,
      showChangeForm: false,
      earliestTime: post.road?.departureDate!,
      latestTime: post.road?.arrivalDate!,
    },
    cargo: {
      category: post.goods?.category!,
      name: post.goods?.name!,
    },
  });

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p>{t('principal')}</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                principal: { ...prev.principal, isCompany: false },
              }))
            }
            title={t('asPhisicalPerson')}
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
            title={t('asCompany')}
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
        <p>{t('carrier')}</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <InputRadio
            onChange={() =>
              setFormState((prev) => ({
                ...prev,
                carrier: { ...prev.carrier, isCompany: false },
              }))
            }
            title={t('asPhisicalPerson')}
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
            title={t('asCompany')}
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
        <p>{t('good')}</p>
        <div className="bg-slate-700">
          <Select
            name="wareCategory"
            containerStytles="bg-slate-800"
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
        </div>
        <Input
          title={t('goodName')}
          value={formState.cargo.name}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              cargo: { ...prev.cargo, name: e.target.value },
            }))
          }
        />
      </div>

      <Road
        from={formState.route.from}
        to={formState.route.to}
        onChangeClick={() =>
          setFormState((prev) => ({
            ...prev,
            route: { ...prev.route, showChangeForm: !prev.route.showChangeForm },
          }))
        }
      />

      <div
        className={`flex justify-between rounded-md bg-slate-700 p-2 ${formState.route.showChangeForm ? 'flex' : 'hidden'}`}
      >
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

      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          title={t('departureDate')}
          type="datetime-local"
          value={formState.route.earliestTime.toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              route: { ...prev.route, earliestTime: e.target.value as unknown as Date },
            }))
          }
        />
        <Input
          title={t('arrivalDate')}
          type="datetime-local"
          value={formState.route.latestTime.toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              route: { ...prev.route, latestTime: e.target.value as unknown as Date },
            }))
          }
        />
      </div>

      <Button type="submit">{t('sendContractProposals')}</Button>
    </form>
  );
}
