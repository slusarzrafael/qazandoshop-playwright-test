import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.fixture';

type FooterRoute = { link: string; url: RegExp; check: (p: Page) => Locator };

const footerRoutes: FooterRoute[] = [
  { link: 'About us', url: /\/about$/, check: (p) => p.getByRole('heading', { name: 'Sobre a QAZANDO' }) },
  { link: 'Privacy Policy', url: /\/privacy-policy$/, check: (p) => p.getByRole('heading', { name: /What personal data we collect/ }) },
  { link: 'Frequently Questions', url: /\/faqs$/, check: (p) => p.getByRole('link', { name: 'This Designer Bronzer Has Even Buyers Splurging!' }).first() },
  { link: 'Order Tracking', url: /\/order-tracking$/, check: (p) => p.getByLabel('Order ID') },
  { link: 'Compare', url: /\/compare$/, check: (p) => p.getByRole('table').getByText('Green Dress For Woman') },
  { link: 'Cart View One', url: /\/cart$/, check: (p) => p.getByRole('heading', { name: 'Cart Total' }) },
  { link: 'Cart View Two', url: /\/cartTwo$/, check: (p) => p.getByRole('heading', { name: 'Cart Total' }) },
  { link: 'Empty Cart', url: /\/empty-cart$/, check: (p) => p.getByRole('heading', { name: 'YOUR CART IS EMPTY' }) },
  { link: 'Checkout View One', url: /\/checkout-one$/, check: (p) => p.getByRole('heading', { name: 'Billings Information' }) },
  { link: 'Checkout View Two', url: /\/checkout-two$/, check: (p) => p.getByRole('heading', { name: 'Billing Details' }) },
  { link: 'Wishlist', url: /\/wishlist$/, check: (p) => p.getByRole('table') },
];

test.describe('Navegação', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.topProductHeading).toBeVisible();
  });

  for (const route of footerRoutes) {
    test(`NAV-01 link "${route.link}" do rodapé deve abrir a página correta`, { tag: '@regressao' }, async ({ page, homePage }) => {
      await homePage.goViaFooter(route.link);
      await expect(page).toHaveURL(route.url);
      await expect(route.check(page)).toBeVisible();
    });
  }

  test('NAV-01 link "Home" do rodapé deve voltar para a home', { tag: '@regressao' }, async ({ page, homePage }) => {
    await homePage.goViaFooter('About us');
    await homePage.goViaFooter('Home');
    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.topProductHeading).toBeVisible();
  });

  test('NAV-02 menu Shop deve exibir submenu e navegar para "Shop Four Grid"', { tag: ['@smoke', '@regressao'] }, async ({ page, homePage, shopPage }) => {
    await homePage.navigateMenu('Shop', 'Shop Four Grid');
    await expect(page).toHaveURL(/\/shop$/);
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('NAV-03 menu Pages deve navegar para "About Us"', { tag: '@regressao' }, async ({ page, homePage }) => {
    await homePage.navigateMenu('Pages', 'About Us');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: 'Sobre a QAZANDO' })).toBeVisible();
  });

  test('NAV-04 rota inexistente deve exibir página 404 com retorno à home', { tag: ['@smoke', '@regressao'] }, async ({ page, notFoundPage, homePage }) => {
    await notFoundPage.goto('/pagina-que-nao-existe');
    await expect(notFoundPage.heading).toBeVisible();
    await expect(notFoundPage.message).toBeVisible();

    await notFoundPage.backHomeLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.topProductHeading).toBeVisible();
  });

  test('NAV-06 cada página deve ter um título próprio', { tag: '@regressao' }, async ({ page, homePage }) => {
    // BUG: every route uses the same <title> "QAZANDO Shop E-Commerce".
    test.fail();
    const homeTitle = await page.title();
    await homePage.topLoginLink.click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveTitle(homeTitle, { timeout: 3_000 });
  });

  test('NAV-07 botões voltar/avançar do navegador devem funcionar na SPA', { tag: '@regressao' }, async ({ page, homePage, loginPage }) => {
    await homePage.topLoginLink.click();
    await expect(loginPage.heading).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(homePage.topProductHeading).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.heading).toBeVisible();
  });

  test('NAV-08 links do topo devem levar a Shop, Login e Cadastro', { tag: '@regressao' }, async ({ page, homePage }) => {
    await homePage.promoLink.click();
    await expect(page).toHaveURL(/\/shop$/);

    await homePage.topLoginLink.click();
    await expect(page).toHaveURL(/\/login$/);

    await homePage.topRegisterLink.click();
    await expect(page).toHaveURL(/\/register$/);
  });
});
