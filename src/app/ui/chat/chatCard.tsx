import { Button } from '../button';

type CardChatProps = {
  chatTitle: string;
  lastMessage: string | undefined;
  notificationCount: number;
  handleClick: () => void;
};

export default function ChatCard({
  chatTitle,
  lastMessage,
  notificationCount,
  handleClick,
}: CardChatProps) {
  return (
    <Button
      onClick={handleClick}
      className="flex items-center justify-between gap-4 rounded-md !bg-slate-700 p-2 leading-8 !text-white"
    >
      <div className="flex w-full flex-col items-start md:w-64 md:items-stretch">
        <h3 className="truncate font-bold text-left">{chatTitle}</h3>
        <p className="truncate font-normal text-left">{lastMessage}</p>
      </div>
      {notificationCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 p-1 font-bold text-black">
          <p>{notificationCount > 9 ? '9+' : notificationCount}</p>
        </div>
      )}
    </Button>
  );
}
