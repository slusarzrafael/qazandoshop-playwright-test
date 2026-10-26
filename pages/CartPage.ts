import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly table: Locator;
  readonly rows: Locator;
  readonly clearCartButton: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly proceedToCheckoutLink: Locator;
  readonly emptyCartHeading: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.clearCartButton = page.getByRole('button', { name: 'Clear cart' });
    this.couponInput = page.getByPlaceholder('Coupon code');
    this.applyCouponButton = page.getByRole('button', { name: 'Apply coupon' });
    this.subtotal = page.locator('.cart_subtotal', { hasText: /^Subtotal/ }).locator('.cart_amount');
    this.total = page.locator('.cart_subtotal', { hasText: /^Total/ }).locator('.cart_amount');
    this.proceedToCheckoutLink = page.getByRole('link', { name: 'Proceed to Checkout' });
    this.emptyCartHeading = page.getByRole('heading', { name: 'YOUR CART IS EMPTY' });
    this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
  }

  async open() {
    await this.goto('/cart');
  }

  row(productName: string) {
    return this.rows.filter({ hasText: productName });
  }

  quantity(productName: string) {
    return this.row(productName).getByRole('spinbutton');
  }

  rowTotal(productName: string) {
    return this.row(productName).locator('td.product_total');
  }

  async remove(productName: string) {
    // Trash icon is a bare <i> without role or accessible name.
    await this.row(productName).locator('i.fa-trash').click();
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
}
