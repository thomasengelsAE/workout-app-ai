import { test, expect } from '@playwright/test';

test.describe('Goal setting flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/goals');
  });

  test('completes goal setting and is redirected to dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /Strength/ }).click();
    await page.getByRole('button', { name: 'Generate My Program' }).click();

    // Should redirect to dashboard after saving
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows error when no training focus selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate My Program' }).click();
    await expect(page.getByText(/training focus/i)).toBeVisible();
  });

  test('can enable hybrid athlete mode', async ({ page }) => {
    await page.getByRole('button', { name: /Strength/ }).click();
    await page.getByRole('switch', { name: /Hybrid Athlete/i }).click();
    await expect(page.getByRole('switch', { name: /Hybrid Athlete/i })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('button', { name: 'Generate My Program' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
