interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`w-full px-2 py-4 text-xl font-bold rounded-md bg-yellow-300 text-slate-800 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
