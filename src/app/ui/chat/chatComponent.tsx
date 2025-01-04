'use client';

import { useState } from 'react';
import Chat from './chat';
import ChatList from './chatList';
import { ChatType } from '../../lib/definitions';

export default function ChatComponent({ chats }: { chats: ChatType[] }) {
  const [chatListHidden, setChatListHidden] = useState(false);
  const [chatHidden, setChatHidden] = useState(true);
  return (
    <div className="flex h-full gap-4">
      <ChatList
        chats={chats}
        hidden={chatListHidden}
        handleClick={() => {
          setChatListHidden(true);
          setChatHidden(false);
        }}
      />
      <Chat
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
