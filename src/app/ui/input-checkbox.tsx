import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  error?: string;
}

export function InputCheckbox({ error, title, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer items-center gap-4 px-2 py-1">
        <input
          type="checkbox"
          {...rest}
          className="h-4 w-4 appearance-none rounded-full border-2 border-white transition-all duration-200 checked:border-yellow-300 checked:bg-yellow-300 hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <span>{title}</span>
      </label>
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
}

export default InputCheckbox;
