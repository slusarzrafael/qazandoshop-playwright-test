import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class FaqPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/faqs');
  }

  question(text: string): Locator {
    return this.page.getByRole('link', { name: text }).first();
  }

  panel(index: number): Locator {
    return this.page.locator(`#collapse${index}`);
  }
}
