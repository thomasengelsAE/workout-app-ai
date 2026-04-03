// Mock requireAuth so the test doesn't pull in next-auth
jest.mock('@/lib/requireAuth', () => ({
  requireAuth: jest.fn().mockResolvedValue({ id: 'user-1', name: 'Test User' }),
}));

import { hasCompletedPhotoPromptToday } from '@/actions/progress';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    progressPhoto: {
      count: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

describe('hasCompletedPhotoPromptToday', () => {
  const mockCount = prisma.progressPhoto.count as jest.Mock;

  beforeEach(() => jest.clearAllMocks());

  it('returns true when photos exist for today', async () => {
    mockCount.mockResolvedValue(3);
    const result = await hasCompletedPhotoPromptToday('user-1');
    expect(result).toBe(true);
  });

  it('returns false when no photos for today', async () => {
    mockCount.mockResolvedValue(0);
    const result = await hasCompletedPhotoPromptToday('user-1');
    expect(result).toBe(false);
  });

  it('queries with date range for today', async () => {
    mockCount.mockResolvedValue(0);
    await hasCompletedPhotoPromptToday('user-1');
    expect(mockCount).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          date: expect.objectContaining({ gte: expect.any(Date), lt: expect.any(Date) }),
        }),
      })
    );
  });
});
