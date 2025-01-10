import ContractForm from '@/src/app/ui/chat/contract/contract-form';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const postId = (await params).id;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Wygeneruj umowę</h1>
      <p className="text-sm text-slate-400">
        Sprawdź poprawność danych, możesz je w tym miejscu edytowac
      </p>
      <ContractForm />
    </div>
  );
}
