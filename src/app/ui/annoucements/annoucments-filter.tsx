'use client';

import { Button } from '../button';
import { ButtonTypes, GoodsCategory } from '../../lib/definitions';
import { ArrowsUpDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Input } from '../input';
import { useState } from 'react';
import { SortDirection, FilterProps } from '../../lib/definitions';
import { Select } from '../select';

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
  const [sortDirection, setSortDirection] = useState(SortDirection.ByNewest);

  if (hidden) {
    return null;
  }

  function handleClick(direction: SortDirection) {
    setSortDirection(direction);
  }

  return (
    <div className="flex flex-col p-2">
      <SortButton
        onClick={() => handleClick(SortDirection.ByNewest)}
        selected={sortDirection == SortDirection.ByNewest}
        content="Od najwcześniejszych"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.ByOldest)}
        selected={sortDirection == SortDirection.ByOldest}
        content="Od najpóźniejszych"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.ByWeightAsc)}
        selected={sortDirection == SortDirection.ByWeightAsc}
        content="Od największej wagi towaru"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.ByWeightDesc)}
        selected={sortDirection == SortDirection.ByWeightDesc}
        content="Od najmniejszej wagi towaru"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.BySizeAsc)}
        selected={sortDirection == SortDirection.BySizeAsc}
        content="
        Od najwiekszych wymiarów towaru"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.BySizeDesc)}
        selected={sortDirection == SortDirection.BySizeDesc}
        content="Od najmniejszych wymiarów towaru"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.ByHeightAsc)}
        selected={sortDirection == SortDirection.ByHeightAsc}
        content="Od najniższej wysokości towaru"
      />
      <SortButton
        onClick={() => handleClick(SortDirection.ByHeightDesc)}
        selected={sortDirection == SortDirection.ByHeightDesc}
        content="Od największej wysokości towaru"
      />
    </div>
  );
}

const FilterOptions = ({ hidden }: { hidden: boolean }) => {
  const [filters, setFilters] = useState<FilterProps>({
    date: {
      departureDate: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 2)),
      },
      arrivalDate: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 2)),
      },
    },
    cities: {
      from: 'PL, Wrocław',
      to: 'DE, Berlin',
    },
    goods: {
      weight: {
        from: 0,
        to: 10_000,
      },
      size: {
        x: {
          from: 0,
          to: 10,
        },
        y: {
          from: 0,
          to: 10,
        },
        height: {
          from: 50,
          to: 400,
        },
      },
      category: GoodsCategory.Other,
    },
  });

  if (hidden) {
    return null;
  }

  const handleDateChange = (
    dateType: 'departureDate' | 'arrivalDate',
    field: 'from' | 'to',
    value: string,
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: {
        ...prevFilters.date,
        [dateType]: {
          ...prevFilters.date[dateType],
          [field]: new Date(value),
        },
      },
    }));
  };

  const handleCityChange = (field: 'from' | 'to', value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      cities: {
        ...prevFilters.cities,
        [field]: value,
      },
    }));
  };

  const handleWeightChange = (field: 'from' | 'to', value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      goods: {
        ...prevFilters.goods,
        weight: {
          ...prevFilters.goods.weight,
          [field]: Number(value),
        },
      },
    }));
  };

  const handleSizeChange = (
    dimension: 'x' | 'y' | 'height',
    field: 'from' | 'to',
    value: string,
  ) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      goods: {
        ...prevFilters.goods,
        size: {
          ...prevFilters.goods.size,
          [dimension]: {
            ...prevFilters.goods.size[dimension],
            [field]: Number(value),
          },
        },
      },
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      goods: {
        ...prevFilters.goods,
        category: value as GoodsCategory,
      },
    }));
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Termin</h1>
          <h2>Data wyjazdu</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="date"
              value={filters.date.departureDate.from.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('departureDate', 'from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="date"
              value={filters.date.departureDate.to.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('departureDate', 'to', e.target.value)}
            />
          </div>
          <h2>Data przyjazdu</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="date"
              value={filters.date.arrivalDate.from.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('arrivalDate', 'from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="date"
              value={filters.date.arrivalDate.to.toISOString().split('T')[0]}
              onChange={(e) => handleDateChange('arrivalDate', 'to', e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Miejsce</h1>
          <Input
            containerStytles="bg-slate-800"
            className="bg-slate-800"
            title="z"
            value={filters.cities.from}
            onChange={(e) => handleCityChange('from', e.target.value)}
          />
          <Input
            containerStytles="bg-slate-800"
            className="bg-slate-800"
            title="do"
            value={filters.cities.to}
            onChange={(e) => handleCityChange('to', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl">Towar</h1>
          <h2>Waga</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="number"
              value={filters.goods.weight.from}
              onChange={(e) => handleWeightChange('from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="number"
              value={filters.goods.weight.to}
              onChange={(e) => handleWeightChange('to', e.target.value)}
            />
          </div>
          <h2>Szerokość podstawy</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="number"
              value={filters.goods.size.x.from}
              onChange={(e) => handleSizeChange('x', 'from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="number"
              value={filters.goods.size.x.to}
              onChange={(e) => handleSizeChange('x', 'to', e.target.value)}
            />
          </div>
          <h2>Długość podstawy</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="number"
              value={filters.goods.size.y.from}
              onChange={(e) => handleSizeChange('y', 'from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="number"
              value={filters.goods.size.y.to}
              onChange={(e) => handleSizeChange('y', 'to', e.target.value)}
            />
          </div>
          <h2>Wysokość</h2>
          <div className="flex gap-2">
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="od"
              type="number"
              value={filters.goods.size.height.from}
              onChange={(e) => handleSizeChange('height', 'from', e.target.value)}
            />
            <Input
              containerStytles="bg-slate-800"
              className="bg-slate-800"
              title="do"
              type="number"
              value={filters.goods.size.height.to}
              onChange={(e) => handleSizeChange('height', 'to', e.target.value)}
            />
          </div>
          <h2>Kategoria towaru</h2>
          <Select
            containerStytles="bg-slate-800"
            className="bg-slate-800"
            title="Kategoria towaru"
            options={[
              { value: 'other', label: 'Inne' },
              { value: 'electronics', label: 'Elektronika' },
              { value: 'furniture', label: 'Meble' },
              { value: 'food', label: 'Żywność' },
            ]}
            value={filters.goods.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          />
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
