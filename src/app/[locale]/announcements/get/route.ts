import { SortDirection } from '@/src/app/lib/definitions';
import { getAnnouncements } from '../../../lib/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sortBy: SortDirection = searchParams.get('sort') as SortDirection;

  const data = await getAnnouncements(sortBy);
  return Response.json(data);
}
