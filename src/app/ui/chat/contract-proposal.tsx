import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';

type ContractProposalProps = {
  contractId: string;
};

export default function ContractProposal({ contractId }: ContractProposalProps) {
  const t = useTranslations('addPost');
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <p className="text-center text-sm text-slate-400">Wysłałeś propozycję umowy</p>
      <Link
        href={`/chats/contract/${contractId}`}
        className="w-fit rounded-md bg-yellow-300 p-2 text-center text-black"
      >
        Otwórz propozycję umowy
      </Link>
    </div>
  );
}
