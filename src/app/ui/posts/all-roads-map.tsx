'use client';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/src/app/ui/posts/map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100">Ładowanie mapy...</div>,
});
import { useEffect, useState } from 'react';
import { AnnoucementProps, Road } from '@/src/app/lib/definitions';

export default function AllRoadsMap() {
  const [roads, setRoads] = useState<Road[]>([]);

  useEffect(() => {
    fetch(`/pl/announcements/get?sort=byNewest&category=all`)
      .then((res) => res.json())
      .then((announcements: AnnoucementProps[]) => {
        const newRoads = announcements.map((announcement: AnnoucementProps) => ({
          from: announcement.fromGeography,
          to: announcement.toGeography,
        }));
        setRoads(newRoads);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
      });
  }, []);

  return <Map className="!h-96 rounded-md" zoom={5} roads={roads} />;
}
