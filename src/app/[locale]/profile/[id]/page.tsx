export const dynamic = 'force-dynamic';

import { getUserById } from '@/src/app/lib/actions';
import Opinions from '../../../ui/posts/opinions';
import Description from '../../../ui/profile/description';
import { verifySession } from '@/src/app/lib/dal';

type Language = {
  value: string;
  label: string;
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const linkUserId = (await params).id;
  const user = await getUserById(linkUserId);
  const { userId } = await verifySession();

  return (
    <div className="gap-4 flex flex-col md:flex-row">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3>O mnie</h3>
          <Description desc={user.userDesc} userId={linkUserId} enabled={userId == linkUserId} />
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Posługuję się jezykami</p>
            {user.languages?.map((langString) => {
              const lang: Language = JSON.parse(langString);
              return <p key={lang.value}>{lang.label}</p>;
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>Informacje o użytkowniku</h3>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Typ użytkownika</p>
            {user.accountType}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Osoba fizyczna</p>
            {user.isPhisicalPerson ? 'Tak' : 'Nie'}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Ostatnio zalogowany</p>
            {user.lastSeen?.toLocaleString()}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Data założenia konta</p>
            {user.createdAt?.toLocaleDateString()}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">Liczba dodanych ogłoszeń</p>
            {user.postCount}
          </div>
        </div>
      </div>
      <Opinions />
    </div>
  );
}
