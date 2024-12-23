import { useEffect, useState } from 'react';
import { SortDirection, FilterProps, AnnoucementProps } from '../../lib/definitions';
import Annoucement from './annoucment';

type WrapperProps = {
  sortDirection: SortDirection;
  filterOptions: FilterProps;
};

export default function AnnoucmentsWrapper({ sortDirection, filterOptions }: WrapperProps) {
  const [annoucements, setAnnoucements] = useState<Array<AnnoucementProps>>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/pl/announcements/get')
      .then((res) => res.json())
      .then((data) => {
        setAnnoucements(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!annoucements) return <p>No annoucements</p>;

  return (
    <div className="flex flex-col gap-4">
      {annoucements.map((annoucement: AnnoucementProps, index) => (
        <Annoucement
          key={index}
          title={annoucement.title}
          fromCity={annoucement.fromCity}
          toCity={annoucement.toCity}
          departureDate={annoucement.departureDate}
          arrivalDate={annoucement.arrivalDate}
          carProps={annoucement.carProps}
        />
      ))}
    </div>
  );
}
