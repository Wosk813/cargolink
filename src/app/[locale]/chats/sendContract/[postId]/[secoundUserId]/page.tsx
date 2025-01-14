import { getPost } from '@/src/app/lib/actions';
import ContractForm from '@/src/app/ui/chat/contract/contract-form';
import { redirect } from '@/src/i18n/routing';

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string; secoundUserId: string }>;
}) {
  const postId = (await params).postId;
  const secoundUserId = (await params).secoundUserId;
  const post = await getPost({ postId: postId, secoundUserId: secoundUserId });
  console.log(post)
  // if (!post) redirect({ href: '/chats', locale: 'pl' });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Wygeneruj umowę</h1>
      <p className="text-sm text-slate-400">
        Sprawdź poprawność danych, możesz je w tym miejscu edytowac
      </p>
      <ContractForm post={post!} />
    </div>
  );
}
