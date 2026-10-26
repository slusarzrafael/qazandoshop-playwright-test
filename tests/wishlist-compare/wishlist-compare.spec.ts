import { test, expect } from '../../fixtures/auth.fixture';
import { initialState, messages } from '../../fixtures/test-data';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ wishlistPage }) => {
    await wishlistPage.open();
    await expect(wishlistPage.rows.first()).toBeVisible();
  });

  test('WSH-01 deve listar os produtos da wishlist', { tag: '@regressao' }, async ({ wishlistPage }) => {
    await expect(wishlistPage.rows).toHaveCount(initialState.wishlist.length);
    for (const item of initialState.wishlist) await expect(wishlistPage.row(item)).toContainText('In Stock');
  });

  test('WSH-02 deve remover um produto da wishlist', { tag: '@regressao' }, async ({ wishlistPage }) => {
    await wishlistPage.remove('Skater Dress');
    await expect(wishlistPage.rows).toHaveCount(initialState.wishlist.length - 1);
    await expect(wishlistPage.row('Skater Dress')).toHaveCount(0);
  });

  test('WSH-03 deve adicionar produto da wishlist ao carrinho', { tag: '@regressao' }, async ({ wishlistPage }) => {
    await wishlistPage.addToCart('Rocking Chair');
    await wishlistPage.expectSwal(...messages.product.cartOk);
    await expect(wishlistPage.cartBadge).toHaveText('4');
  });
});

test.describe('Comparação de produtos', () => {
  test('CMP-01 deve exibir os produtos comparados e remover um deles', { tag: '@regressao' }, async ({ comparePage }) => {
    await comparePage.open();
    await expect(comparePage.productTitles).toHaveText(initialState.compare);

    await comparePage.removeFirst();
    await expect(comparePage.productTitles).toHaveText([initialState.compare[1]]);
  });
});
