export const dynamic = 'force-dynamic';

import { getUserById } from '@/src/app/lib/actions';
import Opinions from '../../../ui/opinions/opinions';
import Description from '../../../ui/profile/description';
import { verifySession } from '@/src/app/lib/dal';
import { getTranslations } from 'next-intl/server';
import { Language } from '@/src/app/lib/definitions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const linkUserId = (await params).id;
  const user = await getUserById(linkUserId);
  const { userId } = await verifySession();
  const t = await getTranslations('profile');

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3>{t('aboutMe')}</h3>
          <Description desc={user.userDesc} userId={linkUserId} enabled={userId == linkUserId} />
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('useLanguages')}</p>
            {user.languages && user.languages.length > 0 ? (
              <>
                {user.languages?.map((langString) => {
                  const lang: Language = JSON.parse(langString);
                  return <p key={lang.value}>{lang.label}</p>;
                })}
              </>
            ) : (
              <p>{t('noInfo')}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{t('userInfo')}</h3>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('accountType')}</p>
            {t(user.accountType)}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('isPhisicalPerson')}</p>
            {user.isPhisicalPerson ? t('yes') : t('no')}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('lastLogged')}</p>
            {user.lastSeen?.toLocaleString()}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('createDate')}</p>
            {user.createdAt?.toLocaleDateString()}
          </div>
          <div className="rounded-md bg-slate-700 p-2">
            <p className="text-sm text-slate-400">{t('postsCount')}</p>
            {user.postCount}
          </div>
        </div>
      </div>
      {user.id && <Opinions forUserId={user.id} onProfile={true} />}
    </div>
  );
}
