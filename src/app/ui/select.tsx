interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  title?: string;
  error?: any;
  containerStytles?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  title,
  className = '',
  error,
  containerStytles,
  options,
  ...rest
}: SelectProps) {
  return (
    <div className={`${containerStytles} w-full rounded-md bg-slate-700 px-2 py-1`}>
      <p className="text-sm text-slate-400">{title}</p>
      <select
        {...rest}
        className={`w-full rounded-md bg-slate-700 text-white transition-colors ${
          error ? 'border border-red-500' : ''
        } ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
}
