import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMe: Locator;
  readonly createAccountLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Login', exact: true });
    // Labels are not associated with inputs (no "for"), so ids are the stable hook.
    this.emailInput = page.locator('#user');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#btnLogin');
    this.rememberMe = page.getByLabel('Lembrar de mim');
    this.createAccountLink = page.getByRole('link', { name: 'Ainda não tem conta?' });
    this.errorMessage = page.locator('.invalid_input');
  }

  async open() {
    await this.goto('/login');
  }

  async fill(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fill(email, password);
    await this.loginButton.click();
  }
}
