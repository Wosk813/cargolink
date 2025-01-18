import { Link } from "@/src/i18n/routing";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const annoucementId = (await params).id;
  return (
    <div>
      <p>Znaleziono ogłoszenie o planowanej trasie pasujące do zlecenia, które chcesz dodać</p>
      <Link href={`/announcements/${annoucementId}`}>Przejdź do ogłoszenia</Link>
    </div>
  );
}