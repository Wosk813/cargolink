import { getAnnouncementsById } from '@/src/app/lib/actions';
import { getTranslations } from 'next-intl/server';
import Description from '@/src/app/ui/posts/desc';
import RoadDetails from '@/src/app/ui/posts/road-details';
import CarInfo from '@/src/app/ui/posts/car-info';
import Opinions from '@/src/app/ui/posts/opinions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const annoucementId = (await params).id;
  const annoucement = await getAnnouncementsById(annoucementId);
  const t = await getTranslations('posts');
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <RoadDetails
          className="w-full"
          from={annoucement?.fromCity}
          to={annoucement?.toCity}
          departureDate={annoucement?.departureDate}
          arrivalDate={annoucement?.arrivalDate}
          fromGeography={annoucement?.fromGeography}
          toGeography={annoucement?.toGeography}
        />
        <div className="flex flex-col justify-between gap-4 md:w-min">
          <Description desc={annoucement?.desc} />
          <CarInfo
            brand={annoucement?.carProps.brand}
            model={annoucement?.carProps.model}
            maxHeight={annoucement?.carProps.maxSize.height}
            maxSize={annoucement?.carProps.maxSize}
            maxWeight={annoucement?.carProps.maxWeight}
          />
        </div>
      </div>
      <Opinions />
    </div>
  );
}
