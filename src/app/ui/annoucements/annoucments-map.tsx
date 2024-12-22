import { Link } from '@/src/i18n/routing';

export default function AnnoucementsMapButt() {
  return (
    <div>
      <Link
        href={'/announcements/map'}
        className="block w-full rounded-md border-2 border-yellow-300 p-4 text-center text-xl text-yellow-300"
      >
        Otwórz mapę tras
      </Link>
    </div>
  );
}
