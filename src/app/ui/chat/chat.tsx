import { Button } from '../button';
import Input from '../input';
import Message from './message';
import { ButtonTypes, ChatMessage, ChatType } from '../../lib/definitions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { sendMessage } from '../../lib/actions';

type ChatProps = {
  hidden: boolean;
  showArrow: boolean;
  arrowClick: () => void;
  chat: ChatType;
  userId: string;
  messages: ChatMessage[];
  isLoading: boolean;
};

export default function Chat({
  hidden,
  showArrow,
  arrowClick,
  chat,
  messages,
  userId,
  isLoading,
}: ChatProps) {
  const [state, handleSend, pending] = useActionState(sendMessage, undefined);

  let userIsAuthor = false;
  if (userId == chat.postAuthorUserId) userIsAuthor = true;

  let languages = userIsAuthor ? chat.interestedUserLanguages : chat.postAuthorUserLanguages;

  return (
    <div className={`flex w-full flex-col justify-between ${hidden ? 'hidden md:block' : ''}`}>
      <div className="flex flex-col gap-4 overflow-auto">
        <div className="flex w-full flex-col gap-2">
          <div
            onClick={arrowClick}
            className={`flex items-center gap-2 md:hidden ${showArrow ? '' : 'hidden'}`}
          >
            <ArrowLeftIcon className="h-4" />
            Pokaż czaty
          </div>
          <h1 className="text-3xl font-bold">
            {userIsAuthor ? chat.interestedUserName : chat.postAuthorUserName}
          </h1>
          <p className="text-sm text-slate-400">Ta osoba posługuje się jezykami</p>
          <p>
            {languages?.length
              ? languages.map((langString) => JSON.parse(langString).label).join(', ')
              : 'Brak informacji'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 overflow-auto">
          {messages?.map((message) => (
            <Message
              key={message.id}
              date={message.sentAt}
              message={message.content}
              myMessage={message.senderId == userId}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <form action={handleSend} className="flex gap-2">
          <Input className="w-full p-2" placeholder="Pisz tutaj" name="message" />
          <input type="hidden" name="chatId" value={chat.id} />
          <Button disabled={pending} type="submit" className="w-min p-2">
            Wyślij
          </Button>
        </form>
        <Button className="border-yellow-300 text-yellow-300" buttType={ButtonTypes.Secondary}>
          Wyślij propozycje umowy
        </Button>
      </div>
    </div>
  );
}
