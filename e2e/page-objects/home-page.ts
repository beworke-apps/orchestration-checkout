import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly body: Locator;
  readonly greetingText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.locator('body');
    this.greetingText = page.getByText('Good morning, Kate');
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyOnPage() {
    await expect(this.page).toHaveURL(/\/$/);
  }

  async verifyDashboardLoaded() {
    await expect(this.body).toBeVisible();
    await expect(this.greetingText).toBeVisible();
  }
}
