import { getContractById } from '@/src/app/lib/actions';
import { verifySession } from '@/src/app/lib/dal';
import { AccountType } from '@/src/app/lib/definitions';
import ContractForm from '@/src/app/ui/chat/contract/contract-form';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const contractId = (await params).id;
  const contractValues = await getContractById(contractId);
  const { accountType } = await verifySession();
  let canAccept = false;
  if (
    (accountType == AccountType.Carrier && !contractValues?.acceptedByCarrier) ||
    (accountType == AccountType.Principal && !contractValues?.acceptedByPrincipal)
  )
    canAccept = true;
  if (!contractValues) return <h1>Error</h1>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Potwierdź warunki umowy</h1>
      <p className="text-sm text-slate-400">
        Sprawdź poprawność danych, możesz je w tym miejscu edytowac
      </p>
      <ContractForm
        initialState={contractValues}
        canAccept={canAccept}
        chatId={contractValues.chatId}
        contractId={contractId}
      />
    </div>
  );
}
