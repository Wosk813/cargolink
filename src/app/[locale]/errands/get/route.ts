export const dynamic = 'force-dynamic';
import { FilterProps, GoodsCategory, SortDirection } from '@/src/app/lib/definitions';
import { getAnnouncements } from '../../../lib/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortBy: SortDirection = searchParams.get('sort') as SortDirection;
  const filterOptions: FilterProps = {
    date: {
      departureDate: {
        from: searchParams.get('departureDateFrom') as unknown as Date,
        to: searchParams.get('departureDateTo') as unknown as Date,
      },
      arrivalDate: {
        from: searchParams.get('arrivalDateFrom') as unknown as Date,
        to: searchParams.get('arrivalDateTo') as unknown as Date,
      },
    },
    cities: {
      from: searchParams.get('fromCity') as string,
      to: searchParams.get('toCity') as string,
    },
    goods: {
      weight: {
        from: searchParams.get('weightFrom') as unknown as number,
        to: searchParams.get('weightTo') as unknown as number,
      },
      size: {
        x: {
          from: searchParams.get('sizeXFrom') as unknown as number,
          to: searchParams.get('sizeXTo') as unknown as number,
        },
        y: {
          from: searchParams.get('sizeYFrom') as unknown as number,
          to: searchParams.get('sizeYTo') as unknown as number,
        },
        height: {
          from: searchParams.get('heightFrom') as unknown as number,
          to: searchParams.get('heightTo') as unknown as number,
        },
      },
      category: searchParams.get('category') as unknown as GoodsCategory,
    },
  };

  const data = await getAnnouncements(sortBy, filterOptions);
  // console.log(data);
  return Response.json(data);
}
