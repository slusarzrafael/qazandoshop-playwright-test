import { expect, type Locator, type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly swalPopup: Locator;
  readonly swalTitle: Locator;
  readonly swalText: Locator;
  readonly swalOk: Locator;
  readonly swalContainer: Locator;
  readonly footer: Locator;
  readonly wishlistBadge: Locator;
  readonly cartBadge: Locator;
  readonly cartToggle: Locator;
  readonly wishlistToggle: Locator;
  readonly cartOffcanvas: Locator;
  readonly wishlistOffcanvas: Locator;
  readonly searchToggle: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly newsletterInput: Locator;
  readonly newsletterButton: Locator;
  readonly mobileMenuToggle: Locator;
  readonly mobileMenu: Locator;
  readonly mobileLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.swalPopup = page.locator('.swal2-popup');
    this.swalTitle = page.locator('#swal2-title');
    this.swalText = page.locator('#swal2-html-container');
    this.swalOk = page.getByRole('button', { name: 'OK' });
    this.swalContainer = page.locator('.swal2-container');
    this.footer = page.getByRole('contentinfo');
    // Header is rendered twice (desktop/sticky); only the visible one is relevant.
    this.wishlistToggle = page.locator('.header-action-link a[href="#offcanvas-wishlish"]').filter({ visible: true }).first();
    this.cartToggle = page
      .locator('.header-action-link a.offcanvas-toggle[href="#!"]:not(.offside-menu)')
      .filter({ visible: true })
      .first();
    this.wishlistBadge = this.wishlistToggle.locator('.item-count');
    this.cartBadge = this.cartToggle.locator('.item-count');
    this.cartOffcanvas = page.locator('#offcanvas-add-cart');
    this.wishlistOffcanvas = page.locator('#offcanvas-wishlish');
    this.searchToggle = page.locator('a.search_width[href="#search"]');
    this.searchInput = page.getByPlaceholder('type keyword(s) here');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.newsletterInput = page.getByPlaceholder('Your Mail');
    this.newsletterButton = page.getByRole('button', { name: 'Send Mail' });
    this.mobileMenuToggle = page.locator('a.offside-menu');
    this.mobileMenu = page.locator('#mobile-menu-offcanvas');
    this.mobileLogo = page.locator('a[href="index.html"]');
  }

  async goto(path = '/') {
    // The home page "load" event waits for dozens of images; assertions auto-wait for the content instead.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForAppReady();
  }

  /** Lazy route chunks show a full-screen loader; under load it can take well over 10s. */
  async waitForAppReady() {
    await expect(this.page.locator('img[alt="loader"]')).toHaveCount(0, { timeout: 30_000 });
  }

  async expectSwal(title: string, text?: string) {
    await expect(this.swalTitle).toHaveText(title);
    if (text !== undefined) await expect(this.swalText).toHaveText(text);
  }

  /** Some alerts have an OK button, others auto-close after ~2.5s. */
  async dismissSwal() {
    if (await this.swalOk.isVisible()) await this.swalOk.click();
    await expect(this.swalContainer).toHaveCount(0);
  }

  async expectNoSwal(timeout = 2_000) {
    const appeared = await this.swalPopup
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
    expect(appeared, 'nenhum alerta deveria ser exibido').toBe(false);
  }

  async openCartOffcanvas() {
    await this.cartToggle.click();
    await expect(this.cartOffcanvas).toBeInViewport({ ratio: 0.9 });
  }

  async openWishlistOffcanvas() {
    await this.wishlistToggle.click();
    await expect(this.wishlistOffcanvas).toBeInViewport({ ratio: 0.9 });
  }

  async search(term: string) {
    await this.searchToggle.click();
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterInput.fill(email);
    await this.newsletterButton.click();
  }

  async goViaFooter(linkName: string) {
    await this.footer.getByRole('link', { name: linkName, exact: true }).click();
    await this.waitForAppReady();
  }

  async isValid(locator: Locator): Promise<boolean> {
    return locator.evaluate((el) => (el as HTMLInputElement).validity.valid);
  }
}
