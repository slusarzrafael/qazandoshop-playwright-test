import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Cadastro de usuário' });
    this.nameInput = page.locator('#user');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.registerButton = page.getByRole('button', { name: 'Cadastrar' });
    this.errorMessage = page.locator('.errorLabel');
  }

  async open() {
    await this.goto('/register');
  }

  async fill(name: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async register(name: string, email: string, password: string) {
    await this.fill(name, email, password);
    await this.registerButton.click();
  }
}
