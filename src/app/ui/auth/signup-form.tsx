'use client';

import {
  AccountType,
  ButtonTypes,
  Company,
  SignupFormData,
  ValidationErrors,
} from '../../lib/definitions';
import Input from '../input';
import { Button } from '../button';
import React, { useState } from 'react';
import { InputRadio } from '../input-radio';
import {
  validateFirstStep,
  validateFourthStep,
  validateSecondStep,
  validateThridStep,
} from '../../[locale]/auth/signup/validation';
import { useTranslations } from 'next-intl';
import LanguageSelector from '@/src/app/ui/auth/language-selector';
import InputCheckbox from '@/src/app/ui/input-checkbox';
import { register } from '@/src/app/lib/actions';
import CompanyForm from './company-form';

export function SignupForm() {
  const t = useTranslations('signup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [companyData, setCompanyData] = useState<Company>({
    companyName: '',
    taxId: '',
    address: { countryId: 0, stateId: 0, cityId: 0, countryIso2: '', countryName: '', city: '' },
  });

  const [formData, setFormData] = useState<SignupFormData>({
    firstname: '',
    lastname: '',
    email: '',
    repeatEmail: '',
    password: '',
    repeatPassword: '',
    accountType: undefined,
    asCompany: undefined,
    company: companyData,
    languages: [],
    isStatuteAccepted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();

    const stepErrors = await validateCurrentStep();

    if (Object.keys(stepErrors).length === 0) {
      if (step < 4) {
        setStep((prev) => prev + 1);
        setErrors({});
      } else {
        try {
          await register(formData);
        } catch (error) {
          console.error('Submission error:', error);
        }
      }
    } else {
      setErrors(stepErrors);
    }
    setIsSubmitting(false);
  };

  const validateCurrentStep = async () => {
    switch (step) {
      case 1:
        return await validateFirstStep(t, formData);
      case 2:
        return validateSecondStep(t, formData);
      case 3:
        return validateThridStep(t, companyData, formData);
      case 4:
        return validateFourthStep(t, formData);
      default:
        return {};
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setErrors({});
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input
              data-testid="firstname-input"
              name="firstname"
              title={t('firstname')}
              error={errors.firstname as string}
              value={formData.firstname}
              onChange={handleChange}
            />
            <Input
              name="lastname"
              title={t('lastname')}
              error={errors.lastname as string}
              value={formData.lastname}
              onChange={handleChange}
            />
            <Input
              name="email"
              type="email"
              title="E-mail"
              error={errors.email as string}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="repeatEmail"
              type="email"
              title={t('repeatEmail')}
              error={errors.repeatEmail as string}
              value={formData.repeatEmail}
              onChange={handleChange}
            />
            <Input
              name="password"
              type="password"
              title={t('password')}
              error={
                Array.isArray(errors.password) && (
                  <div>
                    <ul>
                      {errors.password.map((error) => (
                        <li className="text-sm text-red-500" key={error}>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              name="repeatPassword"
              type="password"
              title={t('repeatPassword')}
              error={errors.repeatPassword as string}
              value={formData.repeatPassword}
              onChange={handleChange}
            />
          </>
        );
      case 2:
        return (
          <>
            <p className="text-xl font-semibold">{t('accountType')}</p>
            {errors.accountType && (
              <div className="mt-1 text-sm text-red-500">{errors.accountType}</div>
            )}
            <InputRadio
              checked={formData.accountType == AccountType.Carrier}
              name="accountType"
              title={t('asCarrier')}
              desc={t('asCarrierDesc')}
              onChange={() => {
                setFormData((prevState) => ({
                  ...prevState,
                  accountType: AccountType.Carrier,
                }));
              }}
            />
            <InputRadio
              checked={formData.accountType == AccountType.Principal}
              name="accountType"
              title={t('asPrincipal')}
              desc={t('asPrincipalDesc')}
              onChange={() => {
                setFormData((prevState) => ({
                  ...prevState,
                  accountType: AccountType.Principal,
                }));
              }}
            />
          </>
        );
      case 3:
        return (
          <>
            <p className="text-xl font-semibold">{t('asCompany')}</p>
            <p className="text-sm text-slate-400">{t('asCompanyDesc')}</p>
            {errors.asCompany && (
              <div className="mt-1 text-sm text-red-500">{errors.asCompany}</div>
            )}
            <InputRadio
              checked={formData.asCompany != undefined ? formData.asCompany : false}
              name="asCompany"
              title={t('company')}
              onChange={() =>
                setFormData((prevState) => ({
                  ...prevState,
                  asCompany: true,
                }))
              }
            />
            <CompanyForm value={companyData} onChange={setCompanyData} errors={errors} />
            <InputRadio
              checked={formData.asCompany != undefined ? !formData.asCompany : false}
              name="asCompany"
              title={t('asPhisicalPerson')}
              onChange={() =>
                setFormData((prevState) => ({
                  ...prevState,
                  asCompany: false,
                }))
              }
            />
          </>
        );
      case 4:
        console.log(formData);
        return (
          <>
            <p className="text-xl font-semibold">{t('whatLanguagesDoYouKnow')}</p>
            <p className="text-sm text-slate-400">{t('whatLanguagesDoYouKnowDesc')}</p>
            <LanguageSelector
              name="languages"
              onChange={(value) => {
                formData.languages = value;
              }}
              title={t('chooseLanguages')}
            />
            <InputCheckbox
              error={errors.isStatuteAccepted as string}
              title={t('acceptedStatute')}
              name="isStatuteAccepted"
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:overflow-auto">
      {renderCurrentStep()}
      <div className="flex flex-col justify-between gap-2">
        {step > 1 && (
          <Button buttType={ButtonTypes.Secondary} type="button" onClick={handleBack}>
            {t('back')}
          </Button>
        )}
        <Button data-testid="button-next" type="submit" disabled={isSubmitting}>
          {step === 4 ? t('submit') : t('next')}
        </Button>
      </div>
    </form>
  );
}
