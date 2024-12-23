import { useEffect, useState } from 'react';
import { SortDirection, FilterProps, AnnoucementProps } from '../../lib/definitions';
import Annoucement from './annoucment';
import { Link } from '@/src/i18n/routing';

type WrapperProps = {
  sortDirection: SortDirection;
  filterOptions: FilterProps;
};

export default function AnnoucmentsWrapper({ sortDirection, filterOptions }: WrapperProps) {
  const [annoucements, setAnnoucements] = useState<Array<AnnoucementProps>>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/pl/announcements/get?sort=${sortDirection}`)
      .then((res) => res.json())
      .then((data) => {
        setAnnoucements(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
        setLoading(false);
      });
  }, [sortDirection]);

  if (isLoading) return <p>Loading...</p>;
  if (!annoucements || annoucements.length === 0) return <p>No announcements</p>;

  return (
    <div className="flex max-h-full flex-col gap-4 overflow-visible">
      {annoucements.map((annoucement: AnnoucementProps, index) => (
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
      ))}
    </div>
  );
}
