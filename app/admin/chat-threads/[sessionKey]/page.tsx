import ClientChat from './ClientChat';

export default async function Page({
  params,
}: {
  params: Promise<{ sessionKey: string }>;
}) {
  const resolvedParams = await params;

  return <ClientChat sessionKey={resolvedParams.sessionKey} />;
}