import { getInitialContractValues } from '@/src/app/lib/actions';
import ContractForm from '@/src/app/ui/chat/contract/contract-form';
import { redirect } from '@/src/i18n/routing';

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string; secoundUserId: string; chatId: string }>;
}) {
  const postId = (await params).postId;
  const secoundUserId = (await params).secoundUserId;
  const chatId = (await params).chatId;
  const initialContractValues = await getInitialContractValues({ postId: postId, secoundUserId: secoundUserId });

  // if (!post) redirect({ href: '/chats', locale: 'pl' });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Wygeneruj umowę</h1>
      <p className="text-sm text-slate-400">
        Sprawdź poprawność danych, możesz je w tym miejscu edytowac
      </p>
      <ContractForm initialState={initialContractValues!} chatId={chatId} />
    </div>
  );
}
