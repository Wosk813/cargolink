import { ContractFormState } from '@/src/app/lib/definitions';
import Input from '../../input';
import AddressSelect from './address-select';

export default function CompanyForm({
  value,
  onChange,
}: {
  value: NonNullable<ContractFormState['principal']['companyDetails']>;
  onChange: (details: NonNullable<ContractFormState['principal']['companyDetails']>) => void;
}) {
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
        label="Podaj adres przedsiębiorstwa"
      />
    </div>
  );
}
