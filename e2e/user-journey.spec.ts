import { test, expect } from '@playwright/test';

test.describe('Full user journey', () => {
  test('onboarding → goal setting → dashboard', async ({ page }) => {
    await page.goto('/onboarding');

    // Demographics
    await page.getByRole('button', { name: 'Male' }).click();
    await page.getByLabel('Age').fill('30');
    await page.getByLabel('Height (cm)').fill('180');
    await page.getByLabel('Weight (kg)').fill('85');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Experience
    await page.getByRole('button', { name: /Advanced/ }).click();
    await page.getByRole('button', { name: 'Powerlifting' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Activities
    await page.getByRole('button', { name: 'Fitness' }).click();
    await page.getByRole('button', { name: 'Running' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Schedule
    await page.locator('button').filter({ hasText: '5' }).first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Injuries
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    // Goals
    await expect(page).toHaveURL('/goals');
    await page.getByRole('button', { name: /Strength/ }).click();
    await page.getByRole('button', { name: 'Generate My Program' }).click();

    // Dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/Good morning/i)).toBeVisible();
  });
});
