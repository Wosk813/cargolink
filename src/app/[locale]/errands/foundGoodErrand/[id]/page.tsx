import { Link } from '@/src/i18n/routing';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const errandId = (await params).id;
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-slate-400'>Znaleziono zlecenie pasujące do ogłoszenia o planowanej trasie, które chcesz dodać</p>
      <Link className="rounded-md bg-yellow-300 p-2 text-black w-fit" href={`/errands/${errandId}`}>
        Przejdź do zlecenia
      </Link>
    </div>
  );
}
