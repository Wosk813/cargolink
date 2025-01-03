type CardChatProps = {
  chatTitle: string;
  lastMessage: string;
  notificationCount: number;
};

export default function ChatCard({ chatTitle, lastMessage, notificationCount }: CardChatProps) {
  return (
    <div className="flex items-center gap-4 rounded-md bg-slate-700 p-2 leading-8">
      <div className="flex w-64 flex-col">
        <h3 className="truncate font-bold">{chatTitle}</h3>
        <p className="truncate">{lastMessage}</p>
      </div>
      {notificationCount > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 p-1 font-bold text-black">
          <p>{notificationCount > 9 ? '9+' : notificationCount}</p>
        </div>
      )}
    </div>
  );
}
