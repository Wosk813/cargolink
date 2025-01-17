import { useTranslations } from 'next-intl';
import { Address, Company, ValidationErrors } from '../../lib/definitions';
import 'react-country-state-city/dist/react-country-state-city.css';
import Input from '../input';
import AddressSelect from '../address-select';

export default function CompanyForm({
  value,
  onChange,
  errors,
}: {
  errors: ValidationErrors;
  value: Company;
  onChange: (address: Company) => void;
}) {
  const t = useTranslations('signup');
  return (
    <div className="flex flex-col gap-2">
      <Input
        name="companyName"
        error={errors.companyName as string}
        title={t('companyName')}
        value={value.companyName}
        onChange={(e) => {
          onChange({
            ...value,
            companyName: e.target.value,
          });
        }}
      />
      <Input
        name="nip"
        error={errors.taxId as string}
        title="NIP"
        value={value.taxId}
        onChange={(e) => {
          onChange({
            ...value,
            taxId: e.target.value,
          });
        }}
      />
      <AddressSelect
        value={value.address}
        onChange={(address: Address) => {
          onChange({
            ...value,
            address: address,
          });
        }}
      />
      {errors.address?.city && (
        <div className="mt-1 text-sm text-red-500">{errors.address?.city}</div>
      )}
      {errors.address?.postalCode && (
        <div className="mt-1 text-sm text-red-500">{errors.address?.postalCode}</div>
      )}
      {errors.address?.street && (
        <div className="mt-1 text-sm text-red-500">{errors.address?.street}</div>
      )}
    </div>
  );
}
