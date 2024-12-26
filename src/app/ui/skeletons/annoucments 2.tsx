import { ArrowRightIcon } from '@heroicons/react/24/outline';

const FormattedDate = ({ date }: { date: Date }) => {
  const dateFormat = date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timeFormat = date.toLocaleString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="flex flex-col">
      <strong>{dateFormat}</strong>
      <p>{timeFormat}</p>
    </div>
  );
};

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function AnnoucmentsWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className={`${shimmer} flex flex-col gap-2 rounded-md bg-slate-700 p-4 md:gap-4`}>
        <h1 className="rounded-md bg-slate-600 p-2 py-6 text-xl"></h1>
        <div className={`${shimmer} flex justify-between rounded-md bg-slate-600 p-4`}>
          <div className="flex flex-col">
            <p className="text-sm text-slate-400"></p>
            <h2 className="text-xl"></h2>
          </div>
          <ArrowRightIcon className="w-8 text-slate-400" />
          <div className="flex flex-col">
            <p className="text-sm text-slate-400"></p>
            <h2 className="text-xl"></h2>
          </div>
        </div>
        <div className="flex gap-2 md:gap-4">
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-600 p-4">
            <p className="text-sm text-slate-400"></p>
            <div className="flex flex-col">
              <strong></strong>
              <p></p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-md bg-slate-600 p-4 py-6">
            <p className="text-sm text-slate-400"></p>
            <div className="flex flex-col">
              <strong></strong>
              <p></p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-nowrap md:gap-4">
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-600 p-4 py-8">
            <p className="text-sm text-slate-400"></p>
            <p className="text-center text-xl md:text-2xl"></p>
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-600 p-4 py-8">
            <p className="text-sm text-slate-400"></p>
            <p className="text-center text-xl md:text-2xl"></p>
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-600 p-4 py-8">
            <p className="text-sm text-slate-400"></p>
            <p className="text-center text-xl md:text-2xl"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
