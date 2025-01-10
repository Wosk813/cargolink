import { ContractFormState } from '@/src/app/lib/definitions';
import Input from '../../input';
import AddressSelect from './address-select';

export default function PhisicalPersonForm({
  value,
  onChange,
}: {
  value: NonNullable<ContractFormState['principal']['personDetails']>;
  onChange: (details: NonNullable<ContractFormState['principal']['personDetails']>) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        title="Imię i nazwisko"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
      <AddressSelect
        value={value.address}
        onChange={(address) => onChange({ ...value, address })}
        label="Podaj adres"
      />
    </div>
  );
}
