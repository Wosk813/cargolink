import { getTranslations } from 'next-intl/server';

export default async function Description({ desc }: { desc: string | undefined }) {
  const t = await getTranslations('posts');
  return (
    <div className="flex h-full flex-col rounded-md bg-slate-700 p-2">
      <p className="text-xl">{t('desc')}</p>
      <div className="mt-4 flex-1 rounded-md bg-slate-800 p-2">{desc}</div>
    </div>
  );
}
