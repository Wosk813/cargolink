interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
}

export function Input({ title, className = "", ...rest }: InputProps) {
  return (
    <div className="bg-slate-700 px-2 py-1 rounded-md">
      <p className="text-slate-400 text-sm">{title}</p>
      <input
        type="text"
        {...rest}
        className={`w-full bg-slate-700 text-white transition-colors ${className}`}
      ></input>
    </div>
  );
}
