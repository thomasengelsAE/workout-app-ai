import { getSession } from '@/actions/session';
import { SessionView } from '@/components/session/SessionView';
import { notFound } from 'next/navigation';

export default async function SessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) notFound();

  return (
    <SessionView
      sessionId={session.id}
      sessionType={session.sessionType}
      exercises={session.exercises}
    />
  );
}
