import Link from 'next/link';
import { getUserById } from '../../lib/actions';
import { Opinion } from '../../lib/definitions';
import Stars from './starts';

export default async function OpinionCard({ opinion }: { opinion: Opinion }) {
  if (!opinion.authorId) return <p>Error</p>;
  const user = await getUserById(opinion.authorId);
  return (
    <div className="flex flex-col gap-2 rounded-md bg-slate-800 p-2">
      <p className="text-sm text-slate-400">{opinion.createdAt?.toLocaleString()}</p>
      <Link href={`/pl/profile/${opinion.authorId}`}>{`${user.firstname} ${user.lastname}`}</Link>
      <Stars stars={opinion.stars} />
      <p>{opinion.desc}</p>
    </div>
  );
}
