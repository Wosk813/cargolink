import { formatWeight } from './annoucment';

type CarInfoProps = {
  brand: string | undefined;
  model: string | undefined;
  maxWeight: number | undefined;
  maxSize: { x: number | undefined; y: number | undefined } | undefined;
  maxHeight: number | undefined;
};

export default function CarInfo({ brand, model, maxWeight, maxSize, maxHeight }: CarInfoProps) {
  return (
    <div className="rounded-md bg-slate-700 p-2">
      <div className="flex flex-col gap-2">
        <p className="text-xl">Informacje o pojeździe</p>
        <div className="flex justify-between rounded-md bg-slate-800 p-2">
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">marka</p>
            <p>{brand}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-slate-400">model</p>
            <p>{model}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">Maksymalna waga towarów</p>
            <p className="text-center text-xl">{formatWeight(maxWeight)}</p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">maksymalny wymiar towarów </p>
            <p className="text-center text-xl">
              {maxSize?.x}x{maxSize?.y}
            </p>
          </div>
          <div className="rounded-md bg-slate-800 p-2 md:w-full">
            <p className="text-sm text-slate-400">maksymalna wysokość towarów</p>
            <p className="text-center text-xl">{maxHeight} cm</p>
          </div>
        </div>
        <p className="text-sm text-slate-400">
          wymiary podane są w euro paletach <span className="text-white">(120x80cm)</span>
        </p>
      </div>
    </div>
  );
}
