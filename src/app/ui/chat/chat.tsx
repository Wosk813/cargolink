import { Button } from '../button';
import Input from '../input';
import Message from './message';
import { ButtonTypes, ChatType, Language } from '../../lib/definitions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type ChatProps = {
  hidden: boolean;
  showArrow: boolean;
  arrowClick: () => void;
  chat: ChatType;
  userId: string;
};

export default function Chat({ hidden, showArrow, arrowClick, chat, userId }: ChatProps) {
  let userIsAuthor = false;
  if (userId == chat.postAuthorUserId) userIsAuthor = true;

  let languages = userIsAuthor ? chat.interestedUserLanguages : chat.postAuthorUserLanguages;
  return (
    <div className={`flex w-full flex-col justify-between ${hidden ? 'hidden md:block' : ''}`}>
      <div className="flex h-96 w-full flex-col gap-2 overflow-auto">
        <div
          onClick={arrowClick}
          className={`flex items-center gap-2 md:hidden ${showArrow ? '' : 'hidden'}`}
        >
          <ArrowLeftIcon className="h-4" />
          Pokaż czaty
        </div>
        <h1 className="text-3xl font-bold">
          {userIsAuthor ? chat.interestedUserName : chat.postAuthorUserId}
        </h1>
        <p className="text-sm text-slate-400">Ta osoba posługuje się jezykami</p>
        <p>
          {' '}
          {languages?.length
            ? languages.map((langString) => JSON.parse(langString).label).join(', ')
            : 'Brak informacji'}
        </p>
        <div className="flex w-full flex-col gap-4">
          {chat.messages?.map((message) => (
            <Message
              date={message.sentAt}
              message={message.content}
              myMessage={message.senderId == userId}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input className="w-full p-2" placeholder="Pisz tutaj" />
          <Button className="w-min p-2">Wyślij</Button>
        </div>
        <Button className="border-yellow-300 text-yellow-300" buttType={ButtonTypes.Secondary}>
          Wyślij propozycje umowy
        </Button>
      </div>
    </div>
  );
}
