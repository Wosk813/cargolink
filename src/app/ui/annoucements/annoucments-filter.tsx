'use client';

import { Button } from '../button';
import { ButtonTypes } from '../../lib/definitions';
import { ArrowsUpDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Input } from '../input';
import { useState } from 'react';

interface SortButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  selected?: boolean;
}

function SortButton({ content, selected, ...rest }: SortButtonProps) {
  return (
    <Button
      buttType={ButtonTypes.Normal}
      className={`text-left font-normal ${selected ? 'bg-slate-500' : 'hover:bg-slate-600'}`}
      {...rest}
    >
      {content}
    </Button>
  );
}

function SortOptions({ hidden }: { hidden: boolean }) {
  const [selected, setSelected] = useState(1);

  if (hidden) {
    return null;
  }

  function handleClick(value: number) {
    setSelected(value);
  }

  return (
    <div className="flex flex-col p-2">
      <SortButton
        onClick={() => handleClick(1)}
        selected={selected == 1}
        content="Od najwcześniejszych"
      />
      <SortButton
        onClick={() => handleClick(2)}
        selected={selected == 2}
        content="Od najpóźniejszych"
      />
      <SortButton
        onClick={() => handleClick(3)}
        selected={selected == 3}
        content="Od największej wagi towaru"
      />
      <SortButton
        onClick={() => handleClick(4)}
        selected={selected == 4}
        content="Od najmniejszej wagi towaru"
      />
      <SortButton
        onClick={() => handleClick(5)}
        selected={selected == 5}
        content="Od najmniejszych wymiarów towaru"
      />
      <SortButton
        onClick={() => handleClick(6)}
        selected={selected == 6}
        content="Od najwiekszych wymiarów towaru"
      />
      <SortButton
        onClick={() => handleClick(7)}
        selected={selected == 7}
        content="Od najniższej wysokości towaru"
      />
      <SortButton
        onClick={() => handleClick(8)}
        selected={selected == 8}
        content="Od największej wysokości towaru"
      />
    </div>
  );
}

const FilterOptions = ({ hidden }: { hidden: boolean }) => {
  if (hidden) {
    return null;
  }
  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Termin</h1>
          <h2>Data wyjazdu</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="od"
              type="date"
            />
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="do"
              type="date"
            />
          </div>
          <h2>Data przyjazdu</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="od"
              type="date"
            />
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="do"
              type="date"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Miejsce</h1>
          <Input containerStytles="bg-slate-800" className={'bg-slate-800'} title="z" />
          <Input containerStytles="bg-slate-800" className={'bg-slate-800'} title="do" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Towar</h1>
          <h2>Waga</h2>
          <div className="flex gap-2">
            <Input containerStytles="bg-slate-800" className={'bg-slate-800'} title="od" />
            <Input containerStytles="bg-slate-800" className={'bg-slate-800'} title="do" />
          </div>
          <h2>Szerokość podstawy</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="od"
              type="number"
            />
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="do"
              type="number"
            />
          </div>
          <h2>Długość podstawy</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="od"
              type="number"
            />
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="do"
              type="number"
            />
          </div>
          <h2>Wysokość</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="od"
              type="number"
            />
            <Input
              containerStytles="bg-slate-800"
              className={'bg-slate-800'}
              title="do"
              type="number"
            />
          </div>
          <h2>Kategoria towaru</h2>
          <Input containerStytles="bg-slate-800" className={'bg-slate-800'} title="kategoria" />
        </div>
      </div>
    </div>
  );
};

export default function AnnoucmentsFilters() {
  const [sortOptionsAreHidden, setSortOptionsAreHidden] = useState(true);
  const [filterOptionsAreHidden, setFilterOptionsAreHidden] = useState(true);

  const toggleSortOptions = () => {
    setSortOptionsAreHidden(!sortOptionsAreHidden);
  };

  const toggleFilterOptions = () => {
    setFilterOptionsAreHidden(!filterOptionsAreHidden);
  };

  return (
    <div className="transition-height rounded-md bg-slate-700 duration-300 ease-in-out">
      <div className="flex justify-between">
        <Button
          onClick={toggleSortOptions}
          className="my-4 flex w-full items-center justify-center gap-2 rounded-none border-r border-white !bg-slate-700 px-2 py-2 text-center font-normal text-white"
        >
          <ArrowsUpDownIcon className="h-6" />
          <p className="text-xl">Sortuj</p>
        </Button>
        <Button
          onClick={toggleFilterOptions}
          className="my-4 flex w-full items-center justify-center gap-2 !bg-slate-700 px-2 py-2 text-center font-normal text-white"
        >
          <AdjustmentsHorizontalIcon className="h-6" />
          <p className="text-xl">Filtruj</p>
        </Button>
      </div>
      <SortOptions hidden={sortOptionsAreHidden} />
      <FilterOptions hidden={filterOptionsAreHidden} />
    </div>
  );
}
