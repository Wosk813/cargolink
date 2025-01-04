'use client';

import ChatCard from './chatCard';

type ChatListPorps = {
  hidden: boolean;
  handleClick: () => void;
};

export default function ChatList({ hidden, handleClick }: ChatListPorps) {
  return (
    <div className={`flex flex-col gap-4 ${hidden ? 'hidden' : 'w-full md:w-fit'}`}>
      <h1 className="text-3xl font-bold">Czaty</h1>
      <ChatCard
        handleClick={handleClick}
        chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
        lastMessage="Czy posiada Pan ważne dokumenty?"
        notificationCount={5}
      />
      <ChatCard
        handleClick={handleClick}
        chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
        lastMessage="Czy posiada Pan ważne dokumenty?"
        notificationCount={0}
      />
      <ChatCard
        handleClick={handleClick}
        chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
        lastMessage="Czy posiada Pan ważne dokumenty?"
        notificationCount={1}
      />
    </div>
  );
}
