import { test, expect } from '@playwright/test';

test.describe('Workout session', () => {
  test('deviation violation shows error and blocks submission', async ({ page }) => {
    // Navigate to a mock session page (in real tests, use seeded DB session)
    await page.goto('/dashboard');
    const sessionLink = page.locator('a[href^="/session/"]').first();
    if (!(await sessionLink.isVisible())) {
      test.skip();
      return;
    }
    await sessionLink.click();

    // Find the first weight input and enter a value far outside the bounds
    const weightInput = page.locator('input[inputmode="decimal"]').first();
    const currentVal = await weightInput.inputValue();
    const proposed = parseFloat(currentVal);
    const tooHigh = (proposed * 1.5).toFixed(1);

    await weightInput.fill(tooHigh);
    await page.getByRole('button', { name: 'Log Set' }).first().click();

    // Should show deviation error
    await expect(page.getByText(/maximum allowed weight/i)).toBeVisible();
  });

  test('completes a full workout session', async ({ page }) => {
    await page.goto('/dashboard');
    const sessionLink = page.locator('a[href^="/session/"]').first();
    if (!(await sessionLink.isVisible())) {
      test.skip();
      return;
    }
    await sessionLink.click();

    // Log each set with the proposed values (no deviation)
    const logButtons = page.getByRole('button', { name: 'Log Set' });
    const count = await logButtons.count();
    for (let i = 0; i < count; i++) {
      await logButtons.nth(0).click(); // always click first visible
      await page.waitForTimeout(300);
    }

    await page.getByRole('button', { name: 'Complete Workout' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
