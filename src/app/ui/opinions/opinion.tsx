import Link from 'next/link';
import { Opinion, User } from '../../lib/definitions';
import Stars from './starts';

export default function OpinionCard({ opinion }: { opinion: Opinion }) {
  if (!opinion.authorId) return <p>Error</p>;
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-800 p-2">
      <p className="text-sm text-slate-400">{opinion.createdAt?.toLocaleString()}</p>
      <Link
        href={`/pl/profile/${opinion.authorId}`}
      >{`${opinion.authorFirstName} ${opinion.authorLastName}`}</Link>
      <Stars stars={opinion.stars} height={24} />
      <p>{opinion.desc}</p>
    </div>
  );
}
