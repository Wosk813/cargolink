import { ContractFormState } from '@/src/app/lib/definitions';
import Input from '../../input';
import AddressSelect from '../../address-select';
import { useTranslations } from 'next-intl';

export default function PhisicalPersonForm({
  value,
  onChange,
}: {
  value: NonNullable<ContractFormState['principal']['personDetails']>;
  onChange: (details: NonNullable<ContractFormState['principal']['personDetails']>) => void;
}) {
  const t = useTranslations('addPost');
  return (
    <div className="flex flex-col gap-2">
      <Input
        title={t('fullname')}
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <AddressSelect
        value={value.address}
        onChange={(address) => onChange({ ...value, address })}
        label={t('address')}
      />
    </div>
  );
}
