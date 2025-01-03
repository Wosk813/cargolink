import ChatCard from '../../ui/chat/chatCard';

export default function Page() {
  return (
    <div className="flex">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">Czaty</h1>
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
    </div>
  );
}
