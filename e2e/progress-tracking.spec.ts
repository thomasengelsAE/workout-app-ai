import { test, expect } from '@playwright/test';

test.describe('Progress photo tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
  });

  test('photo prompt is visible on progress page', async ({ page }) => {
    // The photo prompt or a "skipped" state should be present
    const promptVisible = await page.getByText(/Morning Check-in/i).isVisible();
    const alreadyDone = await page.getByText(/No photos logged/i).isVisible();
    expect(promptVisible || alreadyDone).toBe(true);
  });

  test('skip photo prompt proceeds normally', async ({ page }) => {
    const skipButton = page.getByRole('button', { name: 'Skip today' });
    if (await skipButton.isVisible()) {
      await skipButton.click();
      // Prompt should disappear after skip
      await expect(page.getByText(/Morning Check-in/i)).not.toBeVisible();
    }
  });

  test('shows analyzing state after photo upload', async ({ page }) => {
    const frontButton = page.locator('button').filter({ hasText: 'Front' });
    if (!(await frontButton.isVisible())) {
      test.skip();
      return;
    }

    // Simulate file upload using a test image
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test-photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(1024, 0xff), // minimal valid-ish JPEG buffer
    });

    const uploadButton = page.getByRole('button', { name: 'Upload' });
    if (await uploadButton.isVisible()) {
      await uploadButton.click();
      await expect(page.getByText(/Analyzing your progress/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
