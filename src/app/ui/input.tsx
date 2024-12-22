interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  error?: any;
  containerStytles?: string;
}

export function Input({ title, className = '', error, containerStytles, ...rest }: InputProps) {
  return (
    <div className={`${containerStytles} w-full rounded-md bg-slate-700 px-2 py-1`}>
      <p className="text-sm text-slate-400">{title}</p>
      <input
        type="text"
        {...rest}
        className={`w-full rounded-md bg-slate-700 text-white transition-colors ${
          error ? 'border border-red-500' : ''
        } ${className}`}
      />
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
}
