'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import ContractPdf from './contract-pdf';
import { Contract } from '@/src/app/lib/definitions';

export default function ContractPdfWrapper({ contract }: { contract: Contract }) {
  return (
    <PDFDownloadLink document={<ContractPdf contract={contract} />} fileName="umowa.pdf">
      Pobierz umowę
    </PDFDownloadLink>
  );
}
