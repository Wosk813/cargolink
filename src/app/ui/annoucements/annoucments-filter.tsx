import { Button } from '../button';
import { ButtonTypes } from '../../lib/definitions';
import { ArrowsUpDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SortButton = ({ content }: { content: string }) => {
  return (
    <Button buttType={ButtonTypes.Normal} className="text-left font-normal hover:bg-slate-600">
      {content}
    </Button>
  );
};

export default function AnnoucmentsFilters() {
  return (
    <div className="transition-height rounded-md bg-slate-700 duration-300 ease-in-out">
      <div className="flex justify-between">
        <Button className="my-4 flex w-full items-center justify-center gap-2 rounded-none border-r border-white !bg-slate-700 px-2 py-2 text-center font-normal text-white">
          <ArrowsUpDownIcon className="h-6" />
          <p className="text-xl">Sortuj</p>
        </Button>
        <Button className="my-4 flex w-full items-center justify-center gap-2 !bg-slate-700 px-2 py-2 text-center font-normal text-white">
          <AdjustmentsHorizontalIcon className="h-6" />
          <p className="text-xl">Filtruj</p>
        </Button>
      </div>
      <div className="flex flex-col p-2">
        <SortButton content="Od najwcześniejszych" />
        <SortButton content="Od najpóźniejszych" />
        <SortButton content="Od największej wagi towaru" />
        <SortButton content="Od najmniejszej wagi towaru" />
        <SortButton content="Od najmniejszych wymiarów towaru" />
        <SortButton content="Od najwiekszych wymiarów towaru" />
        <SortButton content="Od najniższej wysokości towaru" />
        <SortButton content="Od największej wysokości towaru" />
      </div>
    </div>
  );
}
