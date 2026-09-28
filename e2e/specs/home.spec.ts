import { expect, test } from '@playwright/test';

import { HomePage } from '../page-objects/home-page';
import { LoginPage } from '../page-objects/login-page';

test.describe('Dashboard Routing', () => {
  test('should redirect unauthenticated user to sign-in page', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // Act
    await homePage.goto();

    // Assert
    await loginPage.verifyOnPage();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load dashboard home when authenticated', async ({ page, context }) => {
    // Arrange
    const homePage = new HomePage(page);

    await context.addCookies([
      {
        name: 'Template-token',
        value: 'mocked-jwt-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Act
    await homePage.goto();

    // Assert
    await homePage.verifyOnPage();
    await homePage.verifyDashboardLoaded();
  });
});
