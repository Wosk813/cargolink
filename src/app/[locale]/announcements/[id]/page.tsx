import { getAnnouncementsById } from '@/src/app/lib/actions';
import Description from '@/src/app/ui/posts/desc';
import AnnouncementRoadDetails from '@/src/app/ui/posts/announcement-road-details';
import CarInfo from '@/src/app/ui/posts/car-info';
import Opinions from '@/src/app/ui/opinions/opinions';
import { verifySession } from '@/src/app/lib/dal';
import { Button } from '@/src/app/ui/button';
import { getTranslations } from 'next-intl/server';
import GoToChatButton from '@/src/app/ui/posts/go-to-chat-butt';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const annoucementId = (await params).id;
  const annoucement = await getAnnouncementsById(annoucementId);
  if (!annoucement) return <h1>Error</h1>;
  const { userId, isAuth } = await verifySession();
  const t = await getTranslations('posts');
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <AnnouncementRoadDetails
          className="w-full"
          from={annoucement?.fromCity}
          to={annoucement?.toCity}
          departureDate={annoucement?.departureDate}
          arrivalDate={annoucement?.arrivalDate}
          fromGeography={annoucement?.fromGeography}
          toGeography={annoucement?.toGeography}
          postId={annoucement?.id}
          roadColor={annoucement?.roadColor}
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
      <Opinions forUserId={annoucement?.authorId ?? ''} />
      {isAuth && (
        <div
          className={`flex flex-col gap-2 rounded-md bg-slate-700 p-2 ${annoucement?.authorId == userId ? 'hidden' : ''}`}
        >
          <p className="text-xl">{t('contact')}</p>
          <GoToChatButton postId={annoucement?.id} />
        </div>
      )}
    </div>
  );
}
