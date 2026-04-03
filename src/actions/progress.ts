'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { openai } from '@/lib/openai';
import { uploadObject, BUCKET } from '@/lib/gcs';
import { PhotoView } from '@prisma/client';

export type PhotoUploadResult =
  | { success: true }
  | { success: false; error: string };

export async function hasCompletedPhotoPromptToday(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const count = await prisma.progressPhoto.count({
    where: {
      userId,
      date: { gte: today, lt: tomorrow },
    },
  });
  return count > 0;
}

export async function uploadProgressPhoto(
  view: PhotoView,
  base64Data: string,
  mimeType: string
): Promise<PhotoUploadResult> {
  const user = await requireAuth();

  const date = new Date();
  const dateStr = date.toISOString().split('T')[0];
  const gcsKey = `progress-photos/${user.id}/${dateStr}/${view.toLowerCase()}-${Date.now()}.jpg`;

  const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');

  await uploadObject(gcsKey, buffer, mimeType);

  await prisma.progressPhoto.create({
    data: {
      userId: user.id,
      view,
      s3Key: gcsKey,
      date,
    },
  });

  // Trigger async analysis (fire and forget)
  analyzeProgressPhotos(user.id, date).catch(console.error);

  return { success: true };
}

async function analyzeProgressPhotos(userId: string, date: Date): Promise<void> {
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const photos = await prisma.progressPhoto.findMany({
    where: { userId, date: { gte: today, lt: tomorrow } },
  });

  if (photos.length === 0) return;

  // Create pending analysis records
  for (const photo of photos) {
    await prisma.photoAnalysisResult.upsert({
      where: { id: photo.id },
      update: {},
      create: {
        photoId: photo.id,
        analysisText: '',
        laggingAreas: [],
        status: 'PENDING',
      },
    });
  }

  try {
    // For demo: analyze without actual image content (real impl would fetch presigned URLs)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a physique assessment coach. Analyze the described progress photos and identify any aesthetic areas that need more training volume. Return JSON: {"laggingAreas": ["area1", "area2"], "analysisText": "brief summary"}`,
        },
        {
          role: 'user',
          content: `Analyze progress photos (front, side, rear) for user submitted on ${today.toDateString()}. Provide honest aesthetic feedback focusing on muscle development balance.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message.content;
    if (!raw) throw new Error('Empty analysis response');

    const result: { laggingAreas: string[]; analysisText: string } = JSON.parse(raw);

    for (const photo of photos) {
      await prisma.photoAnalysisResult.updateMany({
        where: { photoId: photo.id },
        data: {
          analysisText: result.analysisText,
          laggingAreas: result.laggingAreas,
          status: 'COMPLETE',
        },
      });
    }
  } catch {
    for (const photo of photos) {
      await prisma.photoAnalysisResult.updateMany({
        where: { photoId: photo.id },
        data: { status: 'FAILED' },
      });
    }
  }
}

export async function getLatestAnalysis(userId: string) {
  const latestPhoto = await prisma.progressPhoto.findFirst({
    where: { userId },
    orderBy: { date: 'desc' },
    include: { analysisResults: { orderBy: { analysisDate: 'desc' }, take: 1 } },
  });
  return latestPhoto?.analysisResults[0] ?? null;
}
