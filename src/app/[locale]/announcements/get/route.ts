import { getAnnouncements } from '../../../lib/actions';

export async function GET(request: Request) {
  const data = await getAnnouncements();
  return Response.json(data); 
}
