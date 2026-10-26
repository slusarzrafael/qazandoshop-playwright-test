import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyAccountPage extends BasePage {
  readonly dashboardTab: Locator;
  readonly ordersTab: Locator;
  readonly downloadsTab: Locator;
  readonly addressesTab: Locator;
  readonly accountDetailsTab: Locator;
  readonly logoutLink: Locator;
  readonly totalOrders: Locator;

  constructor(page: Page) {
    super(page);
    const tabs = page.locator('.dashboard_tab_button');
    // Accessible names are prefixed by a FontAwesome glyph, hence the regexes.
    this.dashboardTab = tabs.getByRole('link', { name: /Dashboard$/ });
    this.ordersTab = tabs.getByRole('link', { name: /Orders$/ });
    this.downloadsTab = tabs.getByRole('link', { name: /Downloads$/ });
    this.addressesTab = tabs.getByRole('link', { name: /Addresses$/ });
    this.accountDetailsTab = tabs.getByRole('link', { name: /Account details$/ });
    this.logoutLink = page.getByRole('link', { name: /logout/i }).first();
    this.totalOrders = page.getByText('Total Orders');
  }

  async open() {
    await this.goto('/my-account');
  }

  /** Header badge #userLogged shows the e-mail after login/register. */
  userEmail(email: string) {
    return this.page.locator('#userLogged', { hasText: email });
  }

  async logout() {
    await this.logoutLink.click();
  }
}
