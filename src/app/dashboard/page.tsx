import { requireAuth } from '@/lib/requireAuth';
import { prisma } from '@/lib/prisma';
import { getTodaysNudge } from '@/actions/nutrition';
import { hasCompletedPhotoPromptToday, getLatestAnalysis } from '@/actions/progress';
import { NutritionNudge } from '@/components/nutrition/NutritionNudge';
import { PhotoPrompt } from '@/components/progress/PhotoPrompt';
import { AnalysisResult } from '@/components/progress/AnalysisResult';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth();

  const [plan, nudge, photoPromptDone, latestAnalysis] = await Promise.all([
    prisma.workoutPlan.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            sessions: {
              where: { completedAt: null },
              orderBy: { dayOfWeek: 'asc' },
              take: 3,
            },
          },
        },
      },
    }),
    getTodaysNudge(user.id),
    hasCompletedPhotoPromptToday(user.id),
    getLatestAnalysis(user.id),
  ]);

  const upcomingSessions = plan?.weeks
    .flatMap((w) => w.sessions)
    .slice(0, 3) ?? [];

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-8 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Good morning 👋</h1>
        <p className="text-sm text-zinc-400">{user.name}</p>
      </div>

      <div className="flex flex-col gap-4">
        {nudge && <NutritionNudge nudgeType={nudge.nudgeType} nudgeText={nudge.nudgeText} />}

        {!photoPromptDone && <PhotoPrompt onDismiss={() => {}} />}

        {latestAnalysis && (
          <AnalysisResult
            status={latestAnalysis.status}
            analysisText={latestAnalysis.analysisText}
            laggingAreas={latestAnalysis.laggingAreas}
          />
        )}

        <div>
          <h2 className="mb-3 text-lg font-semibold">Upcoming Sessions</h2>
          {upcomingSessions.length === 0 ? (
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-center">
              {plan ? (
                <p className="text-zinc-400">No pending sessions — great work!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-zinc-400">No program yet.</p>
                  <Link
                    href="/onboarding"
                    className="rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white"
                  >
                    Start Setup
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-4 active:bg-zinc-800"
                >
                  <div>
                    <p className="font-semibold">{session.sessionType}</p>
                    <p className="text-sm text-zinc-400">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][session.dayOfWeek]}
                    </p>
                  </div>
                  <span className="text-zinc-400">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
