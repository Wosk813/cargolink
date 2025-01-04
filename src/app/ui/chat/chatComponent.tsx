'use client';

import { useState } from 'react';
import Chat from './chat';
import { ChatType } from '../../lib/definitions';
import ChatCard from './chatCard';

export default function ChatComponent({
  chats,
  userId,
  chatId,
}: {
  chats: ChatType[];
  userId: string;
  chatId: string;
}) {
  const [chatListHidden, setChatListHidden] = useState(false);
  const [chatHidden, setChatHidden] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  return (
    <div className="flex h-full gap-4">
      <div className={`flex flex-col gap-4 ${chatListHidden ? 'hidden' : 'w-full md:w-fit'}`}>
        <h1 className="text-3xl font-bold hidden md:block">Czaty</h1>
        {chats.map((chat) => (
          <ChatCard
            key={chat.id}
            handleClick={() => {
              setChatHidden(false);
              setChatListHidden(true);
              setCurrentChatId(chat.id);
            }}
            chatTitle={chat.title}
            lastMessage={chat.messages && chat.messages[chat.messages.length - 1].content}
            notificationCount={
              chat.messages ? chat.messages.filter((message) => !message.readen).length : 0
            }
          />
        ))}
      </div>
      <Chat
        userId={userId}
        chat={chats.find((chat) => chat.id === currentChatId) || ({} as ChatType)}
        hidden={chatHidden}
        showArrow={chatListHidden}
        arrowClick={() => {
          setChatHidden(true);
          setChatListHidden(false);
        }}
      />
    </div>
  );
}
