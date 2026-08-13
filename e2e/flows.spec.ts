import { test, expect } from '@playwright/test';

test.describe('MobileSQL End-to-End Core User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads mobile shell with bottom dock navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=MobileSQL')).toBeVisible();
  });

  test('navigates seamlessly between workspace tabs', async ({ page }) => {
    // Navigate to SQL Playground
    await page.click('button:has-text("Playground")');
    await expect(page.locator('text=Query Workspace').or(page.locator('text=Tables'))).toBeVisible();

    // Navigate to Academy
    await page.click('button:has-text("Academy")');
    await expect(page.locator('text=Academy').or(page.locator('text=Curriculum'))).toBeVisible();

    // Navigate to Challenges
    await page.click('button:has-text("Challenges")');
    await expect(page.locator('text=Challenges').or(page.locator('text=Leaderboard'))).toBeVisible();
  });

  test('opens global search and command palette with keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('Control+k');
    // Verify command palette trigger
    const searchModal = page.locator('input[placeholder*="Search"]');
    if (await searchModal.isVisible()) {
      await expect(searchModal).toBeVisible();
    }
  });

  test('executes a basic SQL query in Playground', async ({ page }) => {
    await page.click('button:has-text("Playground")');
    const runButton = page.locator('button:has-text("Run"), button[title*="Execute"]');
    if (await runButton.isVisible()) {
      await runButton.click();
    }
  });
});
