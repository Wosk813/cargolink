import { Link } from '@/src/i18n/routing';
import { useTranslations } from 'next-intl';

type ContractProposalProps = {
  postId: string;
  secoundUserId: string;
  chatId: string;
};

export default function ContractProposal({ postId, secoundUserId, chatId }: ContractProposalProps) {
  const t = useTranslations('addPost');
  return (
    <div className='flex flex-col gap-2 items-center p-2'>
      <p className="text-center text-sm text-slate-400">Wysłałeś propozycję umowy</p>
      <Link
        href={`/chats/sendContract/${postId}/${secoundUserId}/${chatId}`}
        className="rounded-md bg-yellow-300 p-2 text-center text-black w-fit"
      >
        Otwórz propozycję umowy
      </Link>
    </div>
  );
}
