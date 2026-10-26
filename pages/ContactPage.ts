import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class ContactPage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Get In Touch' });
    this.nameInput = page.getByPlaceholder('Name', { exact: true });
    this.emailInput = page.getByPlaceholder('Email', { exact: true });
    this.phoneInput = page.getByPlaceholder('Phone');
    this.subjectInput = page.getByPlaceholder('Subject');
    this.messageInput = page.getByPlaceholder('Message');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async open() {
    await this.goto('/contact-two');
  }

  async send(data: ContactData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);
    await this.submitButton.click();
  }
}
