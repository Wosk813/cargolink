import Chat from '../../ui/chat/chat';
import ChatCard from '../../ui/chat/chatCard';

export default function Page() {
  return (
    <div className="flex h-full gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Czaty</h1>
        <ChatCard
          chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
          lastMessage="Czy posiada Pan ważne dokumenty?"
          notificationCount={5}
        />
        <ChatCard
          chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
          lastMessage="Czy posiada Pan ważne dokumenty?"
          notificationCount={0}
        />
        <ChatCard
          chatTitle="Zamierzam wybrać się z Wrocławia do Berlina"
          lastMessage="Czy posiada Pan ważne dokumenty?"
          notificationCount={1}
        />
      </div>
      <Chat />
    </div>
  );
}
