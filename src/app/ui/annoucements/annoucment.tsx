import { AnnoucementProps } from '../../lib/definitions';
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

const formatWeight = (weight: number) => {
  if (weight >= 1000) {
    return `${(weight / 1000).toString().replace(/\.0+$/, '')} t`;
  }
  return `${weight} kg`;
};

export default function Annoucement({
  title,
  fromCity,
  toCity,
  departureDate,
  arrivalDate,
  carProps,
}: AnnoucementProps) {
  return (
    <div className="display flex flex-col gap-4 rounded-md bg-slate-700 p-4">
      <h1 className="rounded-md bg-slate-800 p-2 text-xl">{title}</h1>
      <div className="flex justify-between rounded-md bg-slate-800 p-4">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">z</p>
          <h2 className="text-xl">{fromCity}</h2>
        </div>
        <ArrowRightIcon className="w-8 text-slate-400" />
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">do</p>
          <h2 className="text-xl">{toCity}</h2>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">planowan data rozpoczęcia trasy</p>
          <FormattedDate date={new Date(departureDate)} />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">planowana data dotarcia do celu</p>
          <FormattedDate date={new Date(arrivalDate)} />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">maksymalna waga towarów</p>
          <p className="text-center text-2xl">{formatWeight(carProps.maxWeight)}</p>
        </div>
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">maksymalny wymiar towarów</p>
          <p className="text-center text-2xl">
            {carProps.maxSize.x}x{carProps.maxSize.y}
          </p>
        </div>
        <div className="flex w-full flex-col justify-between gap-2 rounded-md bg-slate-800 p-4">
          <p className="text-sm text-slate-400">maksymalna wysokość towarów</p>
          <p className="text-center text-2xl">{carProps.maxSize.height} cm</p>
        </div>
      </div>
    </div>
  );
}
