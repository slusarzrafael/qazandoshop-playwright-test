import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NotFoundPage extends BasePage {
  readonly heading: Locator;
  readonly message: Locator;
  readonly backHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: '404' });
    this.message = page.getByText("We are sorry, the page you've requested is not available");
    this.backHomeLink = page.getByRole('link', { name: 'Back To Home Page' });
  }
}
