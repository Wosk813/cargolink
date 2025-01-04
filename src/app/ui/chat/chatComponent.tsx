'use client';

import { useState } from 'react';
import Chat from './chat';
import ChatList from './chatList';

export default function ChatComponent() {
  const [chatListHidden, setChatListHidden] = useState(false);
  const [chatHidden, setChatHidden] = useState(true);
  return (
    <div className="flex h-full gap-4">
      <ChatList
        hidden={chatListHidden}
        handleClick={() => {
          setChatListHidden(true);
          setChatHidden(false);
          console.log('click');
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
