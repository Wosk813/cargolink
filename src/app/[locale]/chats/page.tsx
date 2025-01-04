import { getChats } from '../../lib/actions';
import { ChatType } from '../../lib/definitions';
import ChatComponent from '../../ui/chat/chatComponent';

export default async function Page() {
  const chats: ChatType[] = await getChats('be036ad5-3fbf-46a2-a191-8adb237e7f62');

  return <ChatComponent chats={chats} />;
}
