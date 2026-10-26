import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly promoLink: Locator;
  readonly topLoginLink: Locator;
  readonly topRegisterLink: Locator;
  readonly desktopMenu: Locator;
  readonly topProductHeading: Locator;
  readonly carousels: Locator;

  constructor(page: Page) {
    super(page);
    this.promoLink = page.getByRole('link', { name: 'Aproveitar...' });
    this.topLoginLink = page.locator('#top_header').getByRole('link', { name: /Login/ });
    this.topRegisterLink = page.locator('#top_header').getByRole('link', { name: /Cadastro/ });
    this.desktopMenu = page.locator('.main-menu');
    this.topProductHeading = page.getByRole('heading', { name: 'Top Product' });
    this.carousels = page.locator('#electronics_banner, #elce_weekly_deal, #instagram_area_one');
  }

  async open() {
    await this.goto('/');
  }

  menuItem(name: string) {
    // Top-level names end with a FontAwesome caret glyph.
    return this.desktopMenu.locator('nav > ul > li > a').filter({ hasText: new RegExp(`^\\s*${name}\\b`) }).first();
  }

  async navigateMenu(parent: string, child: string) {
    await this.menuItem(parent).hover();
    await this.desktopMenu.getByRole('link', { name: child, exact: true }).click();
  }
}
