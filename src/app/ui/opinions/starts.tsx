import { StarIcon as EmptyStar } from '@heroicons/react/24/outline';
import { StarIcon as FullStar } from '@heroicons/react/24/solid';

export default function Stars({ stars = 1, height = 6 }: { stars?: 0 | 1 | 2 | 3 | 4 | 5; height?: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((num) =>
        num <= stars ? (
          <FullStar key={num} className={`h-${height} text-yellow-300`} />
        ) : (
          <EmptyStar key={num} className={`h-${height}`} />
        ),
      )}
    </div>
  );
}
