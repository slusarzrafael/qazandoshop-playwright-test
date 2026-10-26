import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  country: string;
  city: string;
  zip: string;
  address: string;
  notes: string;
}

export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly email: Locator;
  readonly country: Locator;
  readonly city: Locator;
  readonly zip: Locator;
  readonly address: Locator;
  readonly notes: Locator;
  readonly saveInAddressBook: Locator;
  readonly saveButton: Locator;
  readonly placeOrderButton: Locator;
  readonly errorMessages: Locator;
  readonly bankTransferRadio: Locator;
  readonly mobileBankingRadio: Locator;
  readonly paypalRadio: Locator;
  readonly ordersSummary: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByLabel('First name');
    this.lastName = page.getByLabel('Last name');
    this.company = page.getByLabel('Company Name');
    this.email = page.getByLabel('Email Addresse');
    this.country = page.getByLabel('Country');
    this.city = page.getByLabel('State/City');
    this.zip = page.getByLabel('Zip Code');
    this.address = page.getByLabel('Full Address');
    this.notes = page.getByLabel('Additional Notes');
    this.saveInAddressBook = page.getByLabel('Save In Address Book');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.errorMessages = page.locator('.errorLabel');
    this.bankTransferRadio = page.getByRole('radio', { name: 'Direct Bank Transfer' });
    this.mobileBankingRadio = page.getByRole('radio', { name: 'Mobile Banking' });
    this.paypalRadio = page.getByRole('radio', { name: 'Paypal' });
    // Innermost wrapper that holds the "Your Orders" heading.
    this.ordersSummary = page.locator('div', { has: page.getByRole('heading', { name: 'Your Orders' }) }).last();
    this.successHeading = page.getByRole('heading', { name: 'Order success!' });
    this.successMessage = page.getByRole('heading', { name: 'Congrats! Your order was created with sucess!' });
  }

  async open() {
    await this.goto('/checkout-one');
  }

  async fillBilling(data: BillingData) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.company.fill(data.company);
    await this.email.fill(data.email);
    await this.country.selectOption(data.country);
    await this.city.selectOption(data.city);
    await this.zip.fill(data.zip);
    await this.address.fill(data.address);
    await this.notes.fill(data.notes);
  }

  /** Radios sit inside a Bootstrap collapse header that intercepts clicks; the label is clickable. */
  async selectPayment(radioId: 'html' | 'javascript' | 'css') {
    await this.page.locator(`label[for="${radioId}"]`).click();
  }
}
