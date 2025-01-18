import { Link } from '@/src/i18n/routing';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const errandId = (await params).id;
  return (
    <div>
      <p>Znaleziono zlecenie pasujące do ogłoszenia o planowanej trasie, które chcesz dodać</p>
      <Link href={`/errands/${errandId}`}>Przejdź do zlecenia</Link>
    </div>
  );
}
