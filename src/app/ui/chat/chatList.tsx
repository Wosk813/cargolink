'use client';

import { ChatType } from '../../lib/definitions';
import ChatCard from './chatCard';

type ChatListPorps = {
  hidden: boolean;
  handleClick: () => void;
  chats: ChatType[];
};

export default function ChatList({ hidden, handleClick, chats }: ChatListPorps) {
  return (
    <div className={`flex flex-col gap-4 ${hidden ? 'hidden' : 'w-full md:w-fit'}`}>
      <h1 className="text-3xl font-bold">Czaty</h1>
      {chats.map((chat) => (
        <ChatCard
          key={chat.id}
          handleClick={handleClick}
          chatTitle={chat.title}
          lastMessage={chat.messages && chat.messages[chat.messages.length - 1].content}
          notificationCount={
            chat.messages ? chat.messages.filter((message) => !message.readen).length : 0
          }
        />
      ))}
    </div>
  );
}
