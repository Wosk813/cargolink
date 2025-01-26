import { redirect } from '@/src/i18n/routing';
import { verifySession } from '../../lib/dal';
import { getChats } from '../../lib/actions';
import { ChatType } from '../../lib/definitions';

export default async function ChatPage() {
  const { userId } = await verifySession();
  const initialChats: ChatType[] = await getChats(userId);

  if (initialChats.length === 0) {
    return <h1>No chats</h1>;
  }

  redirect({ href: `/chats/${initialChats[0].id}`, locale: 'pl' });
}
