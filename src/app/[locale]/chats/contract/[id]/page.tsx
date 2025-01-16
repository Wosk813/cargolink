import { getInitialContractValues } from '@/src/app/lib/actions';
import ContractForm from '@/src/app/ui/chat/contract/contract-form';
import { redirect } from '@/src/i18n/routing';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const contractId = (await params).id;

  // if (!post) redirect({ href: '/chats', locale: 'pl' });
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Potwierdź warunki umowy</h1>
      <p className="text-sm text-slate-400">
        Sprawdź poprawność danych, możesz je w tym miejscu edytowac
      </p>
      {/* <ContractForm post={post!} chatId={chatId} /> */}
    </div>
  );
}
