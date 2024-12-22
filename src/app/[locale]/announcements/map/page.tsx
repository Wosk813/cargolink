'use client';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/src/app/ui/annoucements/map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100">Ładowanie mapy...</div>,
});
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

export default function Page() {
  const markers = [
    {
      position: [52.2297, 21.0122] as [number, number],
      title: 'Warszawa',
      description: 'Stolica Polski',
    },
    {
      position: [52.233, 21.011] as [number, number],
      title: 'Punkt zainteresowania',
      description: 'Opis punktu',
    },
  ];

  return (
    <div className="p-4">
      <Map center={[52.2297, 21.0122]} zoom={13} />
      <Link className='block w-full bg-slate-600 p-4 text-center text-xl rounded-md' href={'/announcements'}>Zamknij</Link>
    </div>
  );
}
