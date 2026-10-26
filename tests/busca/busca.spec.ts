import { test, expect } from '../../fixtures/auth.fixture';
import { messages } from '../../fixtures/test-data';

test.describe('Busca', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.topProductHeading).toBeVisible();
  });

  test('SRC-01 deve buscar um termo e exibir a listagem de produtos', { tag: ['@smoke', '@regressao'] }, async ({ page, homePage, shopPage }) => {
    await homePage.search('Dress');
    await homePage.expectSwal(...messages.search);
    await expect(page).toHaveURL(/\/shop$/);
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('SRC-02 deve filtrar os produtos pelo termo buscado', { tag: '@regressao' }, async ({ homePage, shopPage }) => {
    // BUG: search ignores the term; "zzzznada" still reports success and lists every product.
    test.fail();
    await homePage.search('zzzznada');
    await homePage.dismissSwal();
    // Wait for the listing to settle before asserting, otherwise the empty pre-render passes.
    await expect(shopPage.pagination).toBeVisible();
    await expect(shopPage.productCards).toHaveCount(0, { timeout: 3_000 });
  });

  test('SRC-03 não deve buscar com o campo vazio', { tag: '@regressao' }, async ({ page, homePage }) => {
    await homePage.searchToggle.click();
    await homePage.searchButton.click();
    expect(await homePage.isValid(homePage.searchInput)).toBe(false);
    await homePage.expectNoSwal();
    await expect(page).not.toHaveURL(/\/shop$/);
  });
});
