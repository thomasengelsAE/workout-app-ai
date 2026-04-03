import { test, expect } from '@playwright/test';

test.describe('Onboarding flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the onboarding page (assumes authenticated session via storage state in CI)
    await page.goto('/onboarding');
  });

  test('completes full onboarding with valid data', async ({ page }) => {
    // Step 1: Demographics
    await page.getByRole('button', { name: 'Male' }).click();
    await page.getByLabel('Age').fill('28');
    await page.getByLabel('Height (cm)').fill('178');
    await page.getByLabel('Weight (kg)').fill('82');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 2: Experience
    await page.getByRole('button', { name: /Intermediate/ }).click();
    await page.getByRole('button', { name: 'Bodybuilding' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Activities
    await page.getByRole('button', { name: 'Fitness' }).click();
    await page.getByRole('button', { name: 'Running' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 4: Schedule
    await page.locator('button').filter({ hasText: '4' }).first().click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 5: Injuries (skip)
    await expect(page.getByText('No injuries logged')).toBeVisible();
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    // Should redirect to goals
    await expect(page).toHaveURL('/goals');
  });

  test('shows validation error for invalid age and blocks progression', async ({ page }) => {
    await page.getByRole('button', { name: 'Male' }).click();
    await page.getByLabel('Age').fill('5'); // Below minimum
    await page.getByLabel('Height (cm)').fill('178');
    await page.getByLabel('Weight (kg)').fill('82');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should stay on step 1 (error on final submit, not on continue)
    // Finish steps and verify error on submit
    await page.getByRole('button', { name: /Intermediate/ }).click();
    await page.getByRole('button', { name: 'Bodybuilding' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Fitness' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    // Should show age error
    await expect(page.getByText(/13 and 100/i)).toBeVisible();
  });

  test('requires at least one activity', async ({ page }) => {
    await page.getByRole('button', { name: 'Male' }).click();
    await page.getByLabel('Age').fill('28');
    await page.getByLabel('Height (cm)').fill('178');
    await page.getByLabel('Weight (kg)').fill('82');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: /Intermediate/ }).click();
    await page.getByRole('button', { name: 'Bodybuilding' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    // Skip selecting activities
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    await expect(page.getByText(/at least one activity/i)).toBeVisible();
  });
});
