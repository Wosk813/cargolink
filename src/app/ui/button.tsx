import { ButtonTypes } from '../lib/definitions';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttType?: ButtonTypes;
  disabledMessage?: string;
}

export function Button({
  children,
  className,
  buttType = ButtonTypes.Primary,
  disabled,
  disabledMessage,
  ...rest
}: ButtonProps) {
  const baseStyles = 'w-full rounded-md px-2 py-2 font-bold text-slate-800 transition-colors';

  const typeStyles = {
    [ButtonTypes.Primary]: 'bg-yellow-300',
    [ButtonTypes.Secondary]: 'bg-none text-white border border-white',
    [ButtonTypes.Tertiary]: 'bg-transparent',
    [ButtonTypes.Normal]: 'bg-slate-700 text-white',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      {...rest}
      disabled={disabled}
      className={`${baseStyles} ${typeStyles[buttType]} ${className} ${disabled ? disabledStyles : ''}`}
    >
      {disabled && disabledMessage ? disabledMessage : children}
    </button>
  );
}
