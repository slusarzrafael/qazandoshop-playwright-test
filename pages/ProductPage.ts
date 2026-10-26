import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly details: Locator;
  readonly quantityInput: Locator;
  readonly decreaseButton: Locator;
  readonly increaseButton: Locator;
  readonly sizeSelect: Locator;
  readonly addToWishlistLink: Locator;
  readonly addToCompareLink: Locator;
  readonly addToCartLink: Locator;
  readonly descriptionTab: Locator;
  readonly additionalInfoTab: Locator;
  readonly reviewTab: Locator;

  constructor(page: Page) {
    super(page);
    this.details = page.locator('.product_details_right_one');
    this.quantityInput = this.details.locator('input[type="number"]');
    // −/+ buttons only contain an icon and have no accessible name.
    this.decreaseButton = this.details.locator('button.button').nth(0);
    this.increaseButton = this.details.locator('button.button').nth(1);
    this.sizeSelect = this.details.locator('select.customs_sel_box');
    this.addToWishlistLink = this.details.getByRole('link', { name: 'Add To Wishlist' });
    this.addToCompareLink = this.details.getByRole('link', { name: 'Add To Compare' });
    this.addToCartLink = this.details.getByRole('link', { name: 'Add To Cart' });
    this.descriptionTab = page.getByRole('link', { name: 'Description', exact: true });
    this.additionalInfoTab = page.getByRole('link', { name: 'Additional Information' });
    this.reviewTab = page.getByRole('link', { name: 'Review', exact: true });
  }

  async open(id: number, variant: 'one' | 'two' = 'one') {
    await this.goto(`/product-details-${variant}/${id}`);
  }

  heading(name: string) {
    return this.page.getByRole('heading', { name, exact: true }).first();
  }

  async addToCart() {
    await this.addToCartLink.click();
  }
}
