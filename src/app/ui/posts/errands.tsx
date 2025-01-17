'use client';

import { Button } from '../button';
import { ButtonTypes, GoodsCategory } from '../../lib/definitions';
import { ArrowsUpDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Input from '../input';
import { useState } from 'react';
import { SortDirection, FilterProps } from '../../lib/definitions';
import { Select } from '../select';
import AnnoucementsMapButt from './map-button';
import { useTranslations } from 'next-intl';
import ErrandsWrapper from './errands-wrapper';

interface SortButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  selected?: boolean;
}

function SortButton({ content, selected, ...rest }: SortButtonProps) {
  return (
    <Button
      buttType={ButtonTypes.Normal}
      className={`text-left font-normal ${selected ? '!bg-yellow-300 !text-black' : 'hover:bg-slate-600'}`}
      {...rest}
    >
      {content}
    </Button>
  );
}

export default function Errands({ asModerator }: { asModerator: boolean }) {
  const [sortOptionsAreHidden, setSortOptionsAreHidden] = useState(true);
  const [filterOptionsAreHidden, setFilterOptionsAreHidden] = useState(true);
  const [sortDirection, setSortDirection] = useState(SortDirection.ByNewest);

  function handleClick(direction: SortDirection) {
    setSortDirection(direction);
    setSortOptionsAreHidden(true);
  }

  const toggleSortOptions = () => {
    setSortOptionsAreHidden(!sortOptionsAreHidden);
  };

  const toggleFilterOptions = () => {
    setFilterOptionsAreHidden(!filterOptionsAreHidden);
  };

  const [filters, setFilters] = useState<FilterProps>({
    date: {
      departureDate: {
        from: null,
        to: null,
      },
      arrivalDate: {
        from: null,
        to: null,
      },
    },
    cities: {
      from: null,
      to: null,
    },
    goods: {
      weight: {
        from: null,
        to: null,
      },
      size: {
        x: {
          from: null,
          to: null,
        },
        y: {
          from: 0,
          to: null,
        },
        height: {
          from: 0,
          to: null,
        },
      },
      category: GoodsCategory.All,
    },
  });

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

  const t = useTranslations('posts');
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="rounded-md bg-slate-700 transition-all duration-300 ease-in-out">
        <div className="flex justify-between">
          <Button
            onClick={toggleSortOptions}
            className="flex w-full items-center justify-center gap-2 rounded-md !bg-slate-700 p-0 text-center font-normal text-white"
          >
            <ArrowsUpDownIcon className="h-6" />
            <p className="text-xl">{t('sort')}</p>
          </Button>
          <Button
            onClick={toggleFilterOptions}
            className="flex w-full items-center justify-center gap-2 !bg-slate-700 p-0 text-center font-normal text-white"
          >
            <AdjustmentsHorizontalIcon className="h-6" />
            <p className="text-xl">{t('filter')}</p>
          </Button>
        </div>
        <div className={`flex flex-col p-2 ${filterOptionsAreHidden ? 'hidden' : ''}`}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">{t('deadline')}</h1>
              <h2>{t('departureDate')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="date"
                  value={
                    filters.date.departureDate.from
                      ? filters.date.departureDate.from.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => handleDateChange('departureDate', 'from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="date"
                  value={
                    filters.date.departureDate.to
                      ? filters.date.departureDate.to.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => handleDateChange('departureDate', 'to', e.target.value)}
                />
              </div>
              <h2>{t('arrivalDate')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="date"
                  value={
                    filters.date.arrivalDate.from
                      ? filters.date.arrivalDate.from.toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => handleDateChange('arrivalDate', 'from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="date"
                  value={
                    filters.date.arrivalDate.to
                      ? filters.date.arrivalDate.to.toISOString().split('T')[0]
                      : 0
                  }
                  onChange={(e) => handleDateChange('arrivalDate', 'to', e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">{t('cities')}</h1>
              <Input
                containerStyles="bg-slate-800"
                className="bg-slate-800"
                title="z"
                value={filters.cities.from ? filters.cities.from : ''}
                onChange={(e) => handleCityChange('from', e.target.value)}
                placeholder="Wrocław"
              />
              <Input
                containerStyles="bg-slate-800"
                className="bg-slate-800"
                title={t('to')}
                value={filters.cities.to ? filters.cities.to : ''}
                onChange={(e) => handleCityChange('to', e.target.value)}
                placeholder="Berlin"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl">{t('ware')}</h1>
              <h2>{t('weight')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="number"
                  value={filters.goods.weight.from ? filters.goods.weight.from : ''}
                  onChange={(e) => handleWeightChange('from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="number"
                  value={filters.goods.weight.to ? filters.goods.weight.to : ''}
                  onChange={(e) => handleWeightChange('to', e.target.value)}
                />
              </div>
              <h2>{t('width')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="number"
                  value={filters.goods.size.x.from ? filters.goods.size.x.from : ''}
                  onChange={(e) => handleSizeChange('x', 'from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="number"
                  value={filters.goods.size.x.to ? filters.goods.size.x.to : ''}
                  onChange={(e) => handleSizeChange('x', 'to', e.target.value)}
                />
              </div>
              <h2>{t('length')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="number"
                  value={filters.goods.size.y.from ? filters.goods.size.y.from : ''}
                  onChange={(e) => handleSizeChange('y', 'from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="number"
                  value={filters.goods.size.y.to ? filters.goods.size.y.to : ''}
                  onChange={(e) => handleSizeChange('y', 'to', e.target.value)}
                />
              </div>
              <h2>{t('height')}</h2>
              <div className="flex gap-2">
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('from')}
                  type="number"
                  value={filters.goods.size.height.from ? filters.goods.size.height.from : ''}
                  onChange={(e) => handleSizeChange('height', 'from', e.target.value)}
                />
                <Input
                  containerStyles="bg-slate-800"
                  className="bg-slate-800"
                  title={t('to')}
                  type="number"
                  value={filters.goods.size.height.to ? filters.goods.size.height.to : ''}
                  onChange={(e) => handleSizeChange('height', 'to', e.target.value)}
                />
              </div>
              <h2>{t('wareCategory')}</h2>
              <Select
                containerStytles="bg-slate-800"
                className="bg-slate-800"
                title={t('wareCategory')}
                options={[
                  { value: 'other', label: t('other') },
                  { value: 'electronics', label: t('electronics') },
                  { value: 'furniture', label: t('furniture') },
                  { value: 'food', label: t('food') },
                  { value: 'textiles', label: t('textiles') },
                  { value: 'construction', label: t('construction') },
                  { value: 'industrial', label: t('industrial') },
                  { value: 'chemicals', label: t('chemicals') },
                  { value: 'agriculture', label: t('agriculture') },
                  { value: 'fuel', label: t('fuel') },
                  { value: 'waste', label: t('waste') },
                  { value: 'automotive', label: t('automotive') },
                  { value: 'pharma', label: t('pharma') },
                  { value: 'metal', label: t('metal') },
                  { value: 'paper', label: t('paper') },
                  { value: 'plastics', label: t('plastics') },
                ]}
                value={filters.goods.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setFilterOptionsAreHidden(true);
              }}
            >
              {t('accept')}
            </Button>
          </div>
        </div>
        <div className={`flex flex-col p-2 ${sortOptionsAreHidden ? 'hidden' : ''}`}>
          <SortButton
            onClick={() => handleClick(SortDirection.ByNewest)}
            selected={sortDirection == SortDirection.ByNewest}
            content={t('ByNewest')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.ByOldest)}
            selected={sortDirection == SortDirection.ByOldest}
            content={t('ByOldest')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.ByWeightDesc)}
            selected={sortDirection == SortDirection.ByWeightDesc}
            content={t('ByWeightDesc')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.ByWeightAsc)}
            selected={sortDirection == SortDirection.ByWeightAsc}
            content={t('ByWeightAsc')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.BySizeDesc)}
            selected={sortDirection == SortDirection.BySizeDesc}
            content={t('BySizeDesc')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.BySizeAsc)}
            selected={sortDirection == SortDirection.BySizeAsc}
            content={t('BySizeAsc')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.ByHeightDesc)}
            selected={sortDirection == SortDirection.ByHeightDesc}
            content={t('ByHeightDesc')}
          />
          <SortButton
            onClick={() => handleClick(SortDirection.ByHeightAsc)}
            selected={sortDirection == SortDirection.ByHeightAsc}
            content={t('ByHeightAsc')}
          />
        </div>
      </div>
      <AnnoucementsMapButt postType="errands" />
      <ErrandsWrapper
        filterOptions={filters}
        sortDirection={sortDirection}
        showNotVerified={asModerator}
      />
    </div>
  );
}
