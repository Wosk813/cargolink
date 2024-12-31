export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { SortDirection, FilterProps, AnnoucementProps, GoodsCategory } from '../../lib/definitions';
import Annoucement from './annoucment';
import { Link } from '@/src/i18n/routing';
import { useRouter } from 'next/navigation';
import AnnouncementsWrapperSkeleton from '../skeletons/annoucments';
import { useLocale } from 'next-intl';
import Errand from './errand';

type WrapperProps = {
  sortDirection: SortDirection;
  filterOptions: FilterProps;
};

export default function ErrandsWrapper({ sortDirection, filterOptions }: WrapperProps) {
  const [errands, setErrands] = useState<Array<AnnoucementProps>>([]);
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
        console.error('Error fetching announcements:', error);
        setLoading(false);
      });
  }, [sortDirection, filterOptions, router]);

  if (isLoading) return <AnnouncementsWrapperSkeleton />;
  if (!errands || errands.length === 0) return <p>No announcements</p>;

  return (
    <div className="flex max-h-full flex-col gap-4 overflow-visible">
      {/* {errands.map((annoucement: AnnoucementProps, index) => (
        <Link key={annoucement.id} href={`/announcements/${annoucement.id}`}>
          <Annoucement
            title={annoucement.title}
            fromCity={annoucement.fromCity}
            toCity={annoucement.toCity}
            departureDate={annoucement.departureDate}
            arrivalDate={annoucement.arrivalDate}
            carProps={annoucement.carProps}
          />
        </Link>
      ))} */}
      <Errand
        title="test"
        fromCity="miasto1"
        toCity="miasto2"
        departureDate={new Date()}
        arrivalDate={new Date()}
        ware={{
          category: GoodsCategory.Electronics,
          name: 'TV',
          weight: 100,
          size: {
            x: 2,
            y: 1,
            height: 200,
          },
          desc: 'opis opis',
        }}
      />
    </div>
  );
}
