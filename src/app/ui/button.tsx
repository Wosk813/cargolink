interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`w-full rounded-md bg-yellow-300 px-2 py-2 font-bold text-slate-800 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
