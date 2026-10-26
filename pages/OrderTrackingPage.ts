import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderTrackingPage extends BasePage {
  readonly orderId: Locator;
  readonly billingEmail: Locator;
  readonly trackButton: Locator;
  readonly completeHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.orderId = page.getByLabel('Order ID');
    this.billingEmail = page.getByLabel('Billing Email');
    this.trackButton = page.getByRole('button', { name: 'Track' });
    this.completeHeading = page.getByRole('heading', { name: 'Your order is completed!' });
  }

  async open() {
    await this.goto('/order-tracking');
  }

  async track(orderId: string, email: string) {
    await this.orderId.fill(orderId);
    await this.billingEmail.fill(email);
    await this.trackButton.click();
  }
}
