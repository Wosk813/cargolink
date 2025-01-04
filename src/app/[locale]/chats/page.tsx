import { getChats } from '../../lib/actions';
import { verifySession } from '../../lib/dal';
import { ChatType } from '../../lib/definitions';
import ChatComponent from '../../ui/chat/chatComponent';

export default async function Page() {
  const { userId } = await verifySession();
  const initialChats: ChatType[] = await getChats(userId);

  return <ChatComponent chats={initialChats} userId={userId} chatId={initialChats[0].id} />;
}
