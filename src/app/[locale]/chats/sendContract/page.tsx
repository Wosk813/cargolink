import ContractForm from '@/src/app/ui/chat/contract/contract-form';

export default async function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Wygeneruj umowę</h1>
      <p>Sprawdź poprawność danych, możesz je w tym miejscu edytowac</p>
      <ContractForm />
    </div>
  );
}
