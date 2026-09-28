import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/Email/i);
    this.passwordInput = page.getByLabel(/Senha/i);
    this.submitButton = page.getByRole('button', { name: /Entrar/i });
  }

  async goto() {
    await this.page.goto('/auth/sign-in');
  }

  async verifyOnPage() {
    await expect(this.page).toHaveURL(/\/auth\/sign-in$/);
  }
}
