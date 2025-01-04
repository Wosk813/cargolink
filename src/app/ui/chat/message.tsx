type messageProps = {
  date: Date;
  message: string;
  myMessage: boolean;
};

export default function Message({ date, message, myMessage }: messageProps) {
  return (
    <div className={`flex w-full flex-col gap-2 ${myMessage ? 'items-end' : 'items-start'}`}>
      <p className="text-sm text-slate-400">{date.toLocaleString()}</p>
      <div
        className={`w-fit rounded-md p-2 ${myMessage ? 'bg-yellow-300 text-black' : 'bg-slate-700 text-white'}`}
      >
        {message}
      </div>
    </div>
  );
}
