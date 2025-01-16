import React from 'react';
import { getContractById } from '@/src/app/lib/actions';
import ContractPdfWrapper from '@/src/app/ui/chat/contract/contract-pdf-wrapper';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const contractId = (await params).id;
  const contract = await getContractById(contractId);
  return (
    <div>
      <h1>Generowanie PDF</h1>
      <ContractPdfWrapper contract={contract!}/>
    </div>
  );
}
