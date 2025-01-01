import { getErrandById } from '@/src/app/lib/actions';
import Description from '@/src/app/ui/posts/desc';
import Opinions from '@/src/app/ui/posts/opinions';
import ErrandRoadDetails from '@/src/app/ui/posts/errand-road-details';
import WareInfo from '@/src/app/ui/posts/ware-info';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const errandId = (await params).id;
  const errand = await getErrandById(errandId);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <ErrandRoadDetails
          className="w-full"
          from={errand?.fromCity}
          to={errand?.toCity}
          earliestAt={errand?.earliestAt}
          latestAt={errand?.latestAt}
          fromGeography={errand?.fromGeography}
          toGeography={errand?.toGeography}
          postId={errand?.id}
          roadColor={errand?.roadColor}
        />
        <div className="flex flex-col justify-between gap-4 md:w-min">
          <Description desc={errand?.desc} />
          <WareInfo
            category={errand?.ware.category}
            name={errand?.ware.name}
            weight={errand?.ware.weight}
            size={errand?.ware.size}
          />
        </div>
      </div>
      <Opinions />
    </div>
  );
}
