import { Button } from '../button';
import Input from '../input';
import Message from './message';
import { ButtonTypes, ChatMessage, ChatType } from '../../lib/definitions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { sendMessage } from '../../lib/actions';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';

type ChatProps = {
  hidden: boolean;
  showArrow: boolean;
  arrowClick: () => void;
  chat: ChatType;
  currentUserId: string;
  messages: ChatMessage[];
  isLoading: boolean;
};

export default function Chat({
  hidden,
  showArrow,
  arrowClick,
  chat,
  messages,
  currentUserId,
  isLoading,
}: ChatProps) {
  const [state, handleSend, pending] = useActionState(sendMessage, undefined);
  const t = useTranslations('chat');
  let userIsAuthor = false;
  if (currentUserId == chat.postAuthorUserId) userIsAuthor = true;

  let languages = userIsAuthor ? chat.interestedUserLanguages : chat.postAuthorUserLanguages;

  const secoundUserId =
    chat.interestedUserId == currentUserId ? chat.postAuthorUserId : chat.interestedUserId;

  return (
    <div className={`flex w-full flex-col justify-between ${hidden ? 'hidden md:block' : ''}`}>
      <div className="flex flex-col gap-4 overflow-auto">
        <div className="flex w-full flex-col gap-2">
          <div
            onClick={arrowClick}
            className={`flex items-center gap-2 md:hidden ${showArrow ? '' : 'hidden'}`}
          >
            <ArrowLeftIcon className="h-4" />
            {t('showChats')}
          </div>
          <Link href={`/profile/${secoundUserId}`} className="text-3xl font-bold">
            {userIsAuthor ? chat.interestedUserName : chat.postAuthorUserName}
          </Link>
          <p className="text-sm text-slate-400">{t('thisPersonSpeaksLanguages')}</p>
          <p>
            {languages?.length
              ? languages.map((langString) => JSON.parse(langString).label).join(', ')
              : t('noInfo')}
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 overflow-auto">
          {messages?.map((message) => (
            <Message
              key={message.id}
              date={message.sentAt}
              message={message.content}
              myMessage={message.senderId == currentUserId}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <form action={handleSend} className="flex gap-2">
          <Input className="w-full p-2" placeholder={t('writeHere')} name="message" />
          <input type="hidden" name="chatId" value={chat.id} />
          <Button disabled={pending} type="submit" className="w-min p-2">
            {t('send')}
          </Button>
        </form>
        <Link
          href={`/chats/sendContract/${chat.announcementId ? chat.announcementId : chat.errandId}/${secoundUserId}/${chat.id}`}
          className="rounded-md border border-yellow-300 p-2 text-center text-yellow-300"
        >
          {t('sendContractProposals')}
        </Link>
      </div>
    </div>
  );
}
