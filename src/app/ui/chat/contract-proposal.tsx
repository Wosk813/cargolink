import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';
import { AccountType } from '../../lib/definitions';

type ContractProposalProps = {
  contractId: string;
  contractSentBy: AccountType;
};

export default function ContractProposal({ contractId, contractSentBy }: ContractProposalProps) {
  const t = useTranslations('addPost');
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <p className="text-center text-sm text-slate-400">
        {contractSentBy == AccountType.Carrier
          ? 'Przewoźnik wysłał propozycję umowy'
          : 'Zleceniodawca wysłał propozycję umowy'}
      </p>
      <Link
        href={`/chats/contract/${contractId}`}
        className="w-fit rounded-md bg-yellow-300 p-2 text-center text-black"
      >
        Otwórz propozycję umowy
      </Link>
    </div>
  );
}
