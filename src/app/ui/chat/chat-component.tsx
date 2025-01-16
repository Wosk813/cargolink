'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chat from './chat';
import { ChatMessage, ChatType } from '../../lib/definitions';
import ChatCard from './chat-card';
import { getMessages, setAsReaden } from '../../lib/actions';
import { useTranslations } from 'next-intl';

export default function ChatComponent({
  chats,
  currentUserId,
  chatId,
  contractId,
}: {
  chats: ChatType[];
  currentUserId: string;
  chatId: string;
  contractId: string | null;
}) {
  const [chatListHidden, setChatListHidden] = useState(false);
  const [chatHidden, setChatHidden] = useState(true);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const t = useTranslations('chat');

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const newMessages = await getMessages(currentChatId);
        setMessages(newMessages);
        if (!chatHidden) setAsReaden(newMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [currentChatId, chatHidden]);

  const handleChatSelect = (selectedChatId: string) => {
    setChatHidden(false);
    setChatListHidden(true);
    setCurrentChatId(selectedChatId);
    router.push(`/pl/chats/${selectedChatId}`);
  };

  if (!chatId) return <h1 className="text-2xl">Brak dostępnych czatów</h1>;

  return (
    <div className="flex h-full gap-4">
      <div
        className={`flex flex-col gap-4 ${chatListHidden ? 'hidden md:flex' : 'w-full md:w-fit'}`}
      >
        <h1 className="hidden text-3xl font-bold md:block">{t('chats')}</h1>
        {chats.map((chat) => (
          <ChatCard
            key={chat.id}
            handleClick={() => handleChatSelect(chat.id)}
            chatTitle={chat.title}
            lastMessage={
              chat.messages && chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].content
                : ''
            }
            notificationCount={
              chat.messages ? chat.messages.filter((message) => !message.readen).length : 0
            }
          />
        ))}
      </div>
      <Chat
        contractId={contractId}
        currentUserId={currentUserId}
        chat={chats.find((chat) => chat.id === currentChatId) || ({} as ChatType)}
        hidden={chatHidden}
        showArrow={chatListHidden}
        messages={messages}
        isLoading={isLoading}
        arrowClick={() => {
          setChatHidden(true);
          setChatListHidden(false);
        }}
      />
    </div>
  );
}
