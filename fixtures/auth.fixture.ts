import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ShopPage } from '../pages/ShopPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ComparePage } from '../pages/ComparePage';
import { OrderTrackingPage } from '../pages/OrderTrackingPage';
import { ContactPage } from '../pages/ContactPage';
import { FaqPage } from '../pages/FaqPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { credentials, messages } from './test-data';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  myAccountPage: MyAccountPage;
  shopPage: ShopPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  wishlistPage: WishlistPage;
  comparePage: ComparePage;
  orderTrackingPage: OrderTrackingPage;
  contactPage: ContactPage;
  faqPage: FaqPage;
  notFoundPage: NotFoundPage;
};

type Auth = {
  /**
   * Logs in through the UI and leaves the page on /my-account.
   * The app keeps the session only in memory (no cookies/storage), so tests using this
   * fixture must navigate by clicking — any page.goto/reload drops the session.
   */
  loggedInUser: { email: string };
};

export const test = base.extend<Pages & Auth>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  myAccountPage: async ({ page }, use) => use(new MyAccountPage(page)),
  shopPage: async ({ page }, use) => use(new ShopPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  wishlistPage: async ({ page }, use) => use(new WishlistPage(page)),
  comparePage: async ({ page }, use) => use(new ComparePage(page)),
  orderTrackingPage: async ({ page }, use) => use(new OrderTrackingPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  faqPage: async ({ page }, use) => use(new FaqPage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),

  loggedInUser: async ({ page, loginPage }, use) => {
    const email = credentials.email;
    await loginPage.open();
    await loginPage.login(email, credentials.password);
    await expect(page).toHaveURL(/\/my-account$/);
    await loginPage.expectSwal(messages.login.successTitle, messages.login.successText(email));
    await loginPage.dismissSwal();
    await use({ email });
  },
});

export { expect };
