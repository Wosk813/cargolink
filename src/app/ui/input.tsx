'use client';

import React, { useEffect, useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  title?: string;
  error?: any;
  containerStyles?: string;
  multiline?: boolean;
}

export default function Input({
  title,
  className = '',
  error,
  containerStyles,
  multiline = false,
  value,
  onChange,
  type,
  ...rest
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (multiline && textareaRef.current) {
      adjustHeight();
    }
  }, [value, multiline]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (multiline) {
      adjustHeight();
    }
  };

  const sharedClasses = `h-auto w-full rounded-md bg-slate-700 text-white transition-colors ${
    error ? 'border border-red-500' : ''
  } ${className}`;

  return (
    <div
      className={`${containerStyles} flex w-full flex-col justify-between rounded-md bg-slate-700 px-2 py-1`}
    >
      <p className="text-sm text-slate-400">{title}</p>
      {multiline ? (
        <textarea
          ref={textareaRef}
          {...(rest as any)}
          value={value}
          onChange={handleChange}
          rows={1}
          className={`${sharedClasses} resize-none overflow-hidden`}
        />
      ) : (
        <input
          type={type}
          {...(rest as any)}
          value={value}
          onChange={handleChange}
          className={sharedClasses}
        />
      )}
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
}
