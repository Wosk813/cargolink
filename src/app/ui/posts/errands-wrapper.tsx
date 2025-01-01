export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { SortDirection, FilterProps, GoodsCategory, ErrandProps } from '../../lib/definitions';
import { Link } from '@/src/i18n/routing';
import { useRouter } from 'next/navigation';
import PostsWrapperSkeleton from '../skeletons/annoucments';
import { useLocale } from 'next-intl';
import Errand from './errand';

type WrapperProps = {
  sortDirection: SortDirection;
  filterOptions: FilterProps;
};

export default function ErrandsWrapper({ sortDirection, filterOptions }: WrapperProps) {
  const [errands, setErrands] = useState<Array<ErrandProps>>([]);
  const [isLoading, setLoading] = useState(true);
  const currentLocale = useLocale();
  const router = useRouter();

  useEffect(() => {
    const buildURLParams = () => {
      const params = new URLSearchParams();

      params.append('sort', sortDirection);

      // Dates
      if (filterOptions.date.departureDate.from) {
        params.append('departureDateFrom', filterOptions.date.departureDate.from.toISOString());
      }
      if (filterOptions.date.departureDate.to) {
        params.append('departureDateTo', filterOptions.date.departureDate.to.toISOString());
      }
      if (filterOptions.date.arrivalDate.from) {
        params.append('arrivalDateFrom', filterOptions.date.arrivalDate.from.toISOString());
      }
      if (filterOptions.date.arrivalDate.to) {
        params.append('arrivalDateTo', filterOptions.date.arrivalDate.to.toISOString());
      }

      // City
      if (filterOptions.cities.from) {
        params.append('fromCity', filterOptions.cities.from);
      }
      if (filterOptions.cities.to) {
        params.append('toCity', filterOptions.cities.to);
      }

      // Goods
      if (filterOptions.goods.weight.from) {
        params.append('weightFrom', filterOptions.goods.weight.from.toString());
      }
      if (filterOptions.goods.weight.to) {
        params.append('weightTo', filterOptions.goods.weight.to.toString());
      }

      // Size
      if (filterOptions.goods.size.x.from) {
        params.append('sizeXFrom', filterOptions.goods.size.x.from.toString());
      }
      if (filterOptions.goods.size.x.to) {
        params.append('sizeXTo', filterOptions.goods.size.x.to.toString());
      }
      if (filterOptions.goods.size.y.from) {
        params.append('sizeYFrom', filterOptions.goods.size.y.from.toString());
      }
      if (filterOptions.goods.size.y.to) {
        params.append('sizeYTo', filterOptions.goods.size.y.to.toString());
      }
      if (filterOptions.goods.size.height.from) {
        params.append('heightFrom', filterOptions.goods.size.height.from.toString());
      }
      if (filterOptions.goods.size.height.to) {
        params.append('heightTo', filterOptions.goods.size.height.to.toString());
      }

      // Category
      if (filterOptions.goods.category) {
        params.append('category', filterOptions.goods.category);
      }

      return params;
    };

    const params = buildURLParams();

    router.push(`/${currentLocale}/errands?${params.toString()}`, { scroll: false });

    setLoading(true);
    fetch(`/pl/errands/get?${params.toString()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setErrands(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching errands:', error);
        setLoading(false);
      });
  }, [sortDirection, filterOptions, router]);

  if (isLoading) return <PostsWrapperSkeleton />;
  if (!errands || errands.length === 0) return <p>No errands</p>;

  return (
    <div className="flex max-h-full flex-col gap-4 overflow-visible">
      {errands.map((errand: ErrandProps, index) => (
        <Link key={errand.id} href={`/errands/${errand.id}`}>
          <Errand
            title={errand.title}
            fromCity={errand.fromCity}
            toCity={errand.toCity}
            earliestAt={errand.earliestAt}
            latestAt={errand.latestAt}
            ware={errand.ware}
          />
        </Link>
      ))}
    </div>
  );
}
