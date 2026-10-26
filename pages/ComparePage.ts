import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ComparePage extends BasePage {
  readonly productTitles: Locator;
  readonly deleteIcons: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.getByRole('table').locator('a.title');
    this.deleteIcons = page.getByRole('table').locator('button:has(i.fa-trash)');
  }

  async open() {
    await this.goto('/compare');
  }

  async removeFirst() {
    await this.deleteIcons.first().click();
  }
}
