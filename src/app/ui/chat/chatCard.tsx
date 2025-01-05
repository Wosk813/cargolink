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
      className="flex w-full items-center justify-between gap-4 rounded-md !bg-slate-700 p-2 leading-8 !text-white md:w-64"
    >
      <div className="flex flex-col items-start md:items-stretch">
        <h3 className="truncate text-left font-bold">{chatTitle}</h3>
        <p className="truncate text-left font-normal">{lastMessage}</p>
      </div>
      {notificationCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 p-1 font-bold text-black">
          <p>{notificationCount > 9 ? '9+' : notificationCount}</p>
        </div>
      )}
    </Button>
  );
}
