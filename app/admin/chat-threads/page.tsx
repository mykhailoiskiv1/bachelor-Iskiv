export const revalidate = 0;
import ChatList from '@/components/admin/chat-threads/ChatList';

type Thread = {
  sessionKey: string;
  createdAt: string;
  lastMessage: string;
  messageCount: number;
  hasAdminReply: boolean;
};

export default async function AdminChatListPage() {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const res = await fetch(`${base}/api/admin/chat-threads`, { cache: 'no-store' });
  const threads: Thread[] = await res.json();

  return <ChatList threads={threads} />;
}
