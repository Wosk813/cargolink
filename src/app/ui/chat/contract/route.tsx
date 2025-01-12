import { Address } from '@/src/app/lib/definitions';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Route({
  from,
  to,
  onChangeClick,
}: {
  from: Address;
  to: Address;
  onChangeClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p>Informacje o trasie</p>
        <button className="text-yellow-300" onClick={onChangeClick}>
          <u>Zmień</u>
        </button>
      </div>
      <div className="flex justify-between rounded-md bg-slate-700 p-2">
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">z</p>
          <h2 className="text-xl">{`${from.countryIso2}, ${from.city}`}</h2>
          <p>{from.street}</p>
        </div>
        <ArrowRightIcon className="w-8 text-slate-400" />
        <div className="flex flex-col">
          <p className="text-sm text-slate-400">do</p>
          <h2 className="text-xl">{`${to.countryIso2}, ${to.city}`}</h2>
          <p>{to.street}</p>
        </div>
      </div>
    </div>
  );
}
