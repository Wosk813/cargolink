import { Address } from '@/src/app/lib/definitions';
import { CitySelect, CountrySelect, StateSelect } from 'react-country-state-city';
import { City, Country, State } from 'react-country-state-city/dist/esm/types';
import Input from '../../input';
import 'react-country-state-city/dist/react-country-state-city.css';
import { useTranslations } from 'next-intl';

export default function AddressSelect({
  value,
  onChange,
  label,
}: {
  value: Address;
  onChange: (address: Address) => void;
  label?: string;
}) {
  const t = useTranslations('addPost');
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-slate-400">{label}</p>}
      <div className="flex flex-col gap-2 text-black md:flex-row">
        <div className="w-full">
          <CountrySelect
            className="w-full"
            onChange={(e) => {
              e = e as Country;
              onChange({
                ...value,
                countryId: e.id,
                countryName: e.name,
                stateId: 0,
                cityId: 0,
                countryIso2: e.iso2,
                city: '',
              });
            }}
            value={value.countryId}
            placeHolder={t('chooseCountry')}
            region="Europe"
          />
        </div>
        <div className="w-full">
          <StateSelect
            value={value.stateId}
            countryid={value.countryId}
            onChange={(e) => {
              e = e as State;
              onChange({
                ...value,
                stateId: e.id,
                cityId: 0,
                city: '',
              });
            }}
            placeHolder={t('chooseState')}
          />
        </div>
        <div className="w-full">
          <CitySelect
            value={value.cityId}
            countryid={value.countryId}
            stateid={value.stateId}
            onChange={(e) => {
              e = e as City;
              onChange({
                ...value,
                city: e.name,
                cityId: e.id,
                geography: { coordinates: [e.latitude, e.longitude] },
              });
            }}
            placeHolder={t('chooseCity')}
          />
        </div>
        <Input
          title={t('postalCode')}
          value={value.postalCode}
          onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
        />
        <Input
          title={t('street')}
          value={value.street}
          onChange={(e) => onChange({ ...value, street: e.target.value })}
        />
      </div>
    </div>
  );
}
