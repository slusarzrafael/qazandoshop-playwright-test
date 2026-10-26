import { test, expect } from '../../fixtures/auth.fixture';
import { credentials, messages, products } from '../../fixtures/test-data';

const viewports = [
  { name: 'desktop', size: { width: 1280, height: 720 }, tags: ['@responsivo'] },
  { name: 'tablet', size: { width: 768, height: 1024 }, tags: ['@responsivo'] },
  { name: 'mobile', size: { width: 375, height: 667 }, tags: ['@responsivo', '@mobile'] },
];

const keyPages = ['/', '/shop', '/login', '/cart', '/checkout-one'];

for (const vp of viewports) {
  test.describe(`Responsividade – ${vp.name} (${vp.size.width}x${vp.size.height})`, () => {
    test.use({ viewport: vp.size });

    for (const path of keyPages) {
      test(`RSP-03 página "${path}" não deve ter rolagem horizontal`, { tag: vp.tags }, async ({ page }) => {
        await page.goto(path, { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('contentinfo')).toBeAttached();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }

    test('RSP-04 login deve funcionar', { tag: vp.tags }, async ({ page, loginPage }) => {
      await loginPage.open();
      await loginPage.login(credentials.email, credentials.password);
      await loginPage.expectSwal(messages.login.successTitle);
      await expect(page).toHaveURL(/\/my-account$/);
    });

    test('RSP-05 deve adicionar produto ao carrinho e atualizar o contador', { tag: vp.tags }, async ({ productPage }) => {
      await productPage.open(products.tShirt.id);
      await productPage.addToCart();
      await productPage.expectSwal(...messages.product.cartOk);
      await expect(productPage.cartBadge).toHaveText('4');
    });
  });
}

test.describe('Responsividade – menu mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.mobileMenuToggle).toBeVisible();
  });

  test('RSP-01 menu hambúrguer deve abrir e fechar o menu lateral', { tag: ['@responsivo', '@mobile', '@smoke'] }, async ({ homePage }) => {
    await expect(homePage.mobileMenu).not.toBeInViewport({ ratio: 0.5 });
    await homePage.mobileMenuToggle.click();
    await expect(homePage.mobileMenu).toBeInViewport({ ratio: 0.5 });
    await expect(homePage.mobileMenu.getByRole('link', { name: 'Wishlist' })).toBeVisible();

    await homePage.mobileMenu.locator('button.offcanvas-close').click();
    await expect(homePage.mobileMenu).not.toBeInViewport({ ratio: 0.5 });
  });

  test('RSP-01 atalho "Cart" do menu mobile deve abrir o carrinho', { tag: ['@responsivo', '@mobile'] }, async ({ page, homePage, cartPage }) => {
    await homePage.mobileMenuToggle.click();
    await homePage.mobileMenu.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartPage.rows.first()).toBeVisible();
  });

  test('RSP-02 item "Shop" do menu mobile deve navegar para a loja', { tag: ['@responsivo', '@mobile'] }, async ({ page, homePage }) => {
    // BUG: mobile menu items are href="#!" with no submenu, so the shop is unreachable from the menu.
    test.fail();
    await homePage.mobileMenuToggle.click();
    await homePage.mobileMenu.getByRole('link', { name: 'Shop', exact: true }).click();
    await expect(page).toHaveURL(/\/shop/, { timeout: 3_000 });
  });

  test('NAV-05 logo do header mobile deve levar à home', { tag: ['@responsivo', '@mobile'] }, async ({ page, homePage }) => {
    // BUG: mobile logo links to "index.html", which renders the 404 page.
    test.fail();
    await homePage.mobileLogo.click();
    await expect(page).toHaveURL(/\/$/, { timeout: 3_000 });
    await expect(homePage.topProductHeading).toBeVisible({ timeout: 3_000 });
  });
});
