import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
  readonly mainArea: Locator;
  readonly productCards: Locator;
  readonly filterSelect: Locator;
  readonly sortSelect: Locator;
  readonly pagination: Locator;
  readonly activePage: Locator;
  readonly quickViewModal: Locator;
  readonly quickViewClose: Locator;

  constructor(page: Page) {
    super(page);
    this.mainArea = page.locator('#shop_main_area');
    this.productCards = this.mainArea.locator('.product_wrappers_one');
    this.filterSelect = this.mainArea.locator('select.customs_sel_box').nth(0);
    this.sortSelect = this.mainArea.locator('select.customs_sel_box').nth(1);
    this.pagination = page.locator('ul.pagination');
    this.activePage = this.pagination.locator('.page-item.active');
    this.quickViewModal = page.locator('.modal.show');
    this.quickViewClose = this.quickViewModal.locator('button.close_modal_icon');
  }

  async open() {
    await this.goto('/shop');
  }

  card(index = 0) {
    return this.productCards.nth(index);
  }

  pageLink(label: string) {
    return this.pagination.getByRole('link', { name: label, exact: true });
  }

  async addToCartFromCard(index = 0) {
    const card = this.card(index);
    await card.hover();
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async addToWishlistFromCard(index = 0) {
    const card = this.card(index);
    await card.hover();
    await card.getByTitle('Wishlist').click();
  }

  async addToCompareFromCard(index = 0) {
    const card = this.card(index);
    await card.hover();
    await card.getByTitle('Compare').click();
  }

  async openQuickView(index = 0) {
    const card = this.card(index);
    await card.hover();
    await card.getByTitle('Quick view').click();
  }

  async sortBy(value: 'Popularity' | 'newness' | 'low' | 'high') {
    await this.sortSelect.selectOption(value);
  }

  async prices(): Promise<number[]> {
    const texts = await this.productCards.locator('.price').allInnerTexts();
    return texts.map((t) => Number(t.replace(/[^0-9.]/g, '')));
  }
}
