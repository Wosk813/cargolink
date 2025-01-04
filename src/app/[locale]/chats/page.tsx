import { getChats } from '../../lib/actions';
import { verifySession } from '../../lib/dal';
import { ChatType } from '../../lib/definitions';
import ChatComponent from '../../ui/chat/chatComponent';

export default async function Page() {
  const { userId } = await verifySession();
  const chats: ChatType[] = await getChats(userId);

  return <ChatComponent chats={chats} userId={userId} chatId={chats[0].id} />;
}
