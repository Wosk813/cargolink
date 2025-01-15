'use client';

import { useActionState, useState } from 'react';
import 'react-country-state-city/dist/react-country-state-city.css';
import Input from '../../input';
import InputRadio from '../../inputRadio';
import { Button } from '../../button';
import { ContractFormState, GoodsCategory, Post } from '@/src/app/lib/definitions';
import AddressSelect from '../../address-select';
import Road from './road';
import CompanyForm from './company-form';
import PhisicalPersonForm from './phisical-person-form';
import { Select } from '../../select';
import { useTranslations } from 'next-intl';
import { addContract } from '@/src/app/lib/actions';

export default function ContractForm({ post, chatId }: { post: Post; chatId: string }) {
  const t = useTranslations('addPost');
  const [state, handleSubmit, pending] = useActionState(addContract, undefined);
  const [formState, setFormState] = useState<ContractFormState>({
    principal: {
      id: post.principal?.id,
      isCompany: post.principal?.isCompany!,
      companyDetails: {
        address: post.principal?.companyDetails?.address!,
        taxId: post.principal?.companyDetails?.taxId!,
        companyName: post.principal?.companyDetails?.companyName!,
      },
      personDetails: {
        name: post.principal?.personDetails?.name!,
        address: {
          countryId: 0,
          stateId: 0,
          cityId: 0,
          countryName: '',
          city: '',
          geography: { coordinates: ['0', '0'] },
          countryIso2: '',
        },
      },
    },
    carrier: {
      id: post.carrier?.id,
      isCompany: post.carrier?.isCompany!,
      companyDetails: {
        address: post.carrier?.companyDetails?.address!,
        taxId: post.carrier?.companyDetails?.taxId!,
        companyName: post.carrier?.companyDetails?.companyName!,
      },
      personDetails: {
        name: post.carrier?.personDetails?.name!,
        address: {
          countryId: 0,
          stateId: 0,
          cityId: 0,
          countryName: '',
          city: '',
          geography: { coordinates: ['0', '0'] },
          countryIso2: '',
        },
      },
    },
    road: {
      from: post.road?.from!,
      to: post.road?.to!,
      showChangeForm: false,
      departureDate: post.road?.departureDate!,
      arrivalDate: post.road?.arrivalDate!,
    },
    good: {
      category: post.goods?.category!,
      name: post.goods?.name!,
    },
  });

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
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
            containerStytles="bg-slate-800"
            title={t('wareCategory')}
            value={formState.good.category}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                good: { ...prev.good, category: e.target.value as GoodsCategory },
              }))
            }
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
          value={formState.good.name}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              good: { ...prev.good, name: e.target.value },
            }))
          }
        />
      </div>

      <Road
        from={formState.road.from}
        to={formState.road.to}
        onChangeClick={() =>
          setFormState((prev) => ({
            ...prev,
            road: { ...prev.road, showChangeForm: !prev.road.showChangeForm },
          }))
        }
      />

      <div
        className={`flex justify-between rounded-md bg-slate-700 p-2 ${formState.road.showChangeForm ? 'flex' : 'hidden'}`}
      >
        <AddressSelect
          value={formState.road.from}
          onChange={(from) =>
            setFormState((prev) => ({
              ...prev,
              road: { ...prev.road, from },
            }))
          }
          label={t('from')}
        />
        <AddressSelect
          value={formState.road.to}
          onChange={(to) =>
            setFormState((prev) => ({
              ...prev,
              road: { ...prev.road, to },
            }))
          }
          label={t('to')}
        />
      </div>

      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          title={t('departureDate')}
          type="datetime-local"
          value={formState.road.departureDate.toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              road: { ...prev.road, departureDate: e.target.value as unknown as Date },
            }))
          }
        />
        <Input
          title={t('arrivalDate')}
          type="datetime-local"
          value={formState.road.arrivalDate.toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              road: { ...prev.road, arrivalDate: e.target.value as unknown as Date },
            }))
          }
        />
      </div>

      <input type="hidden" name="carrier" value={JSON.stringify(formState.carrier)} />
      <input type="hidden" name="principal" value={JSON.stringify(formState.principal)} />
      <input type="hidden" name="good" value={JSON.stringify(formState.good)} />
      <input type="hidden" name="road" value={JSON.stringify(formState.road)} />
      <input type="hidden" name="chatId" value={chatId} />
      <Button disabled={pending} type="submit">
        {t('sendContractProposals')}
      </Button>
    </form>
  );
}
