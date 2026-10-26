import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  readonly rows: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.getByRole('table').locator('tbody tr');
  }

  async open() {
    await this.goto('/wishlist');
  }

  row(productName: string) {
    return this.rows.filter({ hasText: new RegExp(productName, 'i') });
  }

  async remove(productName: string) {
    await this.row(productName).locator('i.fa-trash').click();
  }

  async addToCart(productName: string) {
    await this.row(productName).getByRole('button', { name: 'Add to cart' }).click();
  }
}
