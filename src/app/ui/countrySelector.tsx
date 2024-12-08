import React, { useMemo } from 'react';
import Select, { Props } from 'react-select';
import countryList from 'react-select-country-list';

interface SelectProps extends Props {
  title?: string;
  error?: string;
  onChange?: (value: any) => void;
}

export default function CountrySelector({
  error,
  title,
  className = '',
  onChange,
  ...rest
}: SelectProps) {
  const options = useMemo(() => countryList().getData(), []);
  return (
    <div className="w-full rounded-md bg-slate-700 px-2 py-1">
      <p className="text-sm text-slate-400">{title}</p>
      <Select options={options} {...rest} onChange={onChange} />
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
}
