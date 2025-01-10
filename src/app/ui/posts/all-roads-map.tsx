'use client';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/src/app/ui/posts/map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100">Ładowanie mapy...</div>,
});
import { useEffect, useState } from 'react';
import { AnnouncementProps, Road } from '@/src/app/lib/definitions';

export default function AllRoadsMap({ postType }: { postType: 'announcements' | 'errands' }) {
  const [roads, setRoads] = useState<Road[]>([]);

  useEffect(() => {
    fetch(`/pl/${postType}/get?sort=byNewest&category=all`)
      .then((res) => res.json())
      .then((announcements: AnnouncementProps[]) => {
        const newRoads = announcements.map((announcement: AnnouncementProps) => ({
          from: announcement.fromGeography,
          to: announcement.toGeography,
          postId: announcement.id,
          color: announcement.roadColor,
        }));
        setRoads(newRoads);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
      });
  }, []);

  return (
    <div className="h-full bg-yellow-50 md:relative">
      <Map className="!h-96 rounded-md md:absolute md:!h-full" zoom={5} roads={roads} />
    </div>
  );
}
