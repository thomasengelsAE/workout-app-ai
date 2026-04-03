import { requireAuth } from '@/lib/requireAuth';
import { prisma } from '@/lib/prisma';
import { AnalysisResult } from '@/components/progress/AnalysisResult';
import { PhotoPrompt } from '@/components/progress/PhotoPrompt';

export default async function ProgressPage() {
  const user = await requireAuth();

  const photos = await prisma.progressPhoto.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
    take: 30,
    include: { analysisResults: { orderBy: { analysisDate: 'desc' }, take: 1 } },
  });

  const latestAnalysis = photos[0]?.analysisResults[0] ?? null;

  return (
    <main className="flex min-h-dvh flex-col px-4 pb-8 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-zinc-400">{photos.length} photos logged</p>
      </div>

      <div className="flex flex-col gap-4">
        <PhotoPrompt onDismiss={() => {}} />
        {latestAnalysis && (
          <AnalysisResult
            status={latestAnalysis.status}
            analysisText={latestAnalysis.analysisText}
            laggingAreas={latestAnalysis.laggingAreas}
          />
        )}
      </div>
    </main>
  );
}
