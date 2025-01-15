import { Contract } from '@/src/app/lib/definitions';
import Input from '../../input';
import AddressSelect from '../../address-select';
import { useTranslations } from 'next-intl';

export default function CompanyForm({
  value,
  onChange,
}: {
  value: NonNullable<Contract['principal']['companyDetails']>;
  onChange: (details: NonNullable<Contract['principal']['companyDetails']>) => void;
}) {
  const t = useTranslations('addPost');
  return (
    <div className="flex flex-col gap-2">
      <Input
        title={t('companyFullName')}
        value={value.companyName}
        onChange={(e) => onChange({ ...value, companyName: e.target.value })}
      />
      <Input
        title={t('taxId')}
        value={value.taxId}
        onChange={(e) => onChange({ ...value, taxId: e.target.value })}
      />
      <AddressSelect
        value={value.address}
        onChange={(address) => onChange({ ...value, address })}
        label={t('companyAddress')}
      />
    </div>
  );
}
