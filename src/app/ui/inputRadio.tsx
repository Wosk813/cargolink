import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  desc?: string;
}

export function InputRadio({ title, desc, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer items-center gap-4 px-2 py-1">
        <input
          type="radio"
          {...rest}
          className="h-4 w-4 appearance-none rounded-full border-2 border-white transition-all duration-200 checked:border-yellow-300 checked:bg-yellow-300 focus:outline-none"
        />
        <span>{title}</span>
      </label>
      {desc && <p className="text-justify text-sm text-slate-400">{desc}</p>}
    </div>
  );
}

export default InputRadio;
