import { getChats, getContractIdForChatId } from '@/src/app/lib/actions';
import { verifySession } from '@/src/app/lib/dal';
import { ChatType } from '@/src/app/lib/definitions';
import ChatComponent from '@/src/app/ui/chat/chat-component';

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const chatId = (await params).chatId;
  const { userId } = await verifySession();
  const contractId = await getContractIdForChatId(chatId)
  const initialChats: ChatType[] = await getChats(userId);

  return <ChatComponent chats={initialChats} currentUserId={userId} chatId={chatId} contractId={contractId} />;
}
