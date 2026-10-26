import { test, expect } from '../../fixtures/auth.fixture';
import { messages, products } from '../../fixtures/test-data';

test.describe('Shop – listagem de produtos', () => {
  test.beforeEach(async ({ shopPage }) => {
    await shopPage.open();
    await expect(shopPage.productCards.first()).toBeVisible();
  });

  test('SHP-01 deve listar 30 produtos com paginação', { tag: ['@smoke', '@regressao'] }, async ({ shopPage }) => {
    await expect(shopPage.productCards).toHaveCount(30);
    for (const label of ['1', '2', '3']) await expect(shopPage.pageLink(label)).toBeVisible();
    await expect(shopPage.activePage).toHaveText('1');
  });

  for (const [value, order] of [['low', 'crescente'], ['high', 'decrescente']] as const) {
    test(`SHP-0${value === 'low' ? 2 : 3} deve ordenar por preço em ordem ${order}`, { tag: '@regressao' }, async ({ shopPage }) => {
      // BUG: sorting shuffles products randomly instead of ordering by price.
      test.fail();
      await shopPage.sortBy(value);
      const prices = await shopPage.prices();
      const expected = [...prices].sort((a, b) => (value === 'low' ? a - b : b - a));
      expect(prices).toEqual(expected);
    });
  }

  test('SHP-04 deve adicionar produto ao carrinho a partir do card', { tag: ['@smoke', '@regressao'] }, async ({ shopPage }) => {
    await expect(shopPage.cartBadge).toHaveText('3');
    await shopPage.addToCartFromCard(0);
    await shopPage.expectSwal(...messages.product.cartOk);
    await expect(shopPage.cartBadge).toHaveText('4');
  });

  test('SHP-05 deve adicionar produto à wishlist a partir do card', { tag: '@regressao' }, async ({ shopPage }) => {
    await expect(shopPage.wishlistBadge).toHaveText('4');
    await shopPage.addToWishlistFromCard(0);
    await shopPage.expectSwal(...messages.product.wishlistOk);
    await expect(shopPage.wishlistBadge).toHaveText('5');
  });

  test('SHP-06 quick view deve exibir dados do produto e fechar com Esc e com o botão fechar', { tag: '@regressao' }, async ({ page, shopPage }) => {
    await shopPage.openQuickView(0);
    await expect(shopPage.quickViewModal).toBeVisible();
    await expect(shopPage.quickViewModal).toContainText(products.greenDress.name);
    await expect(shopPage.quickViewModal).toContainText(products.greenDress.price);

    await page.keyboard.press('Escape');
    await expect(shopPage.quickViewModal).toHaveCount(0);

    await shopPage.openQuickView(0);
    await shopPage.quickViewClose.click();
    await expect(shopPage.quickViewModal).toHaveCount(0);
  });

  test('SHP-07 deve informar quando o produto já está na lista de comparação', { tag: '@regressao' }, async ({ shopPage }) => {
    await shopPage.addToCompareFromCard(0);
    await shopPage.expectSwal(...messages.product.compareDuplicated);
  });

  test('SHP-08 deve navegar para a página 2 da listagem', { tag: '@regressao' }, async ({ shopPage }) => {
    await shopPage.pageLink('2').click();
    await expect(shopPage.activePage).toHaveText('2');
    await expect(shopPage.productCards).toHaveCount(30);
  });
});
