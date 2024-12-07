import { ButtonTypes } from '../lib/definitions';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttType?: ButtonTypes;
}

export function Button({
  children,
  className,
  buttType = ButtonTypes.Primary,
  ...rest
}: ButtonProps) {
  const baseStyles = 'w-full rounded-md px-2 py-2 font-bold text-slate-800 transition-colors';

  const typeStyles = {
    [ButtonTypes.Primary]: 'bg-yellow-300',
    [ButtonTypes.Secondary]: 'bg-none text-white border border-white',
    [ButtonTypes.Tertiary]: 'bg-transparent',
  };

  return (
    <button {...rest} className={`${baseStyles} ${typeStyles[buttType]} ${className}`}>
      {children}
    </button>
  );
}
