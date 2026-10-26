import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Regressão visual', () => {
  test('VIS-01 home', { tag: '@visual' }, async ({ page, homePage }) => {
    await homePage.open();
    await expect(homePage.topProductHeading).toBeVisible();
    await page.waitForLoadState('networkidle');
    // Carousels auto-rotate; mask them to keep the snapshot deterministic.
    await expect(page).toHaveScreenshot('home.png', { fullPage: true, mask: [homePage.carousels] });
  });

  test('VIS-02 listagem do shop', { tag: '@visual' }, async ({ page, shopPage }) => {
    await shopPage.open();
    await expect(shopPage.productCards).toHaveCount(30);
    await page.waitForLoadState('networkidle');
    for (let index = 0; index < 4; index++) {
      await shopPage.card(index).locator('img').evaluateAll((images) =>
        Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
      );
    }
    await expect(page).toHaveScreenshot('shop.png', { mask: [shopPage.mainArea.locator('.badges')] });
  });

  test('VIS-03 carrinho', { tag: '@visual' }, async ({ page, cartPage }) => {
    await cartPage.open();
    await expect(cartPage.rows).toHaveCount(3);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('carrinho.png', { fullPage: true });
  });

  test('VIS-04 login', { tag: '@visual' }, async ({ page, loginPage }) => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login.png');
  });
});
