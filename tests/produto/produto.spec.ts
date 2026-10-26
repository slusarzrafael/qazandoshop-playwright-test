import { test, expect } from '../../fixtures/auth.fixture';
import { messages, products } from '../../fixtures/test-data';

test.describe('Detalhe do produto', () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.open(products.tShirt.id);
    await expect(productPage.heading(products.tShirt.name)).toBeVisible();
  });

  test('PDP-01 deve exibir nome, preço e ações do produto', { tag: ['@smoke', '@regressao'] }, async ({ productPage }) => {
    await expect(productPage.details).toContainText(products.tShirt.price);
    await expect(productPage.quantityInput).toHaveValue('1');
    await expect(productPage.addToCartLink).toBeVisible();
    await expect(productPage.addToWishlistLink).toBeVisible();
    await expect(productPage.addToCompareLink).toBeVisible();
  });

  test('PDP-02 deve incrementar e decrementar a quantidade', { tag: '@regressao' }, async ({ productPage }) => {
    await productPage.increaseButton.click();
    await productPage.increaseButton.click();
    await expect(productPage.quantityInput).toHaveValue('3');
    await productPage.decreaseButton.click();
    await expect(productPage.quantityInput).toHaveValue('2');
  });

  test('PDP-03 deve impedir quantidade menor que 1', { tag: '@regressao' }, async ({ productPage }) => {
    await productPage.decreaseButton.click();
    await productPage.expectSwal(...messages.product.minQuantity);
    await expect(productPage.quantityInput).toHaveValue('1');
  });

  test('PDP-04 deve adicionar o produto ao carrinho e atualizar o contador', { tag: ['@smoke', '@regressao'] }, async ({ productPage }) => {
    await expect(productPage.cartBadge).toHaveText('3');
    await productPage.addToCart();
    await productPage.expectSwal(...messages.product.cartOk);
    await expect(productPage.cartBadge).toHaveText('4');
  });

  test('PDP-05 deve impedir adicionar o mesmo produto duas vezes ao carrinho', { tag: '@regressao' }, async ({ productPage }) => {
    await productPage.addToCart();
    await productPage.expectSwal(...messages.product.cartOk);
    await productPage.dismissSwal();

    await productPage.addToCart();
    await productPage.expectSwal(...messages.product.cartDuplicated);
    await expect(productPage.cartBadge).toHaveText('4');
  });

  test('PDP-06 deve adicionar à wishlist e impedir duplicidade', { tag: '@regressao' }, async ({ productPage }) => {
    await productPage.addToWishlistLink.click();
    await productPage.expectSwal(...messages.product.wishlistOk);
    await expect(productPage.wishlistBadge).toHaveText('5');
    await productPage.dismissSwal();

    await productPage.addToWishlistLink.click();
    await productPage.expectSwal(...messages.product.wishlistDuplicated);
    await expect(productPage.wishlistBadge).toHaveText('5');
  });

  test('PDP-07 deve adicionar produto à lista de comparação', { tag: '@regressao' }, async ({ productPage }) => {
    await productPage.open(products.vNeck.id);
    await productPage.addToCompareLink.click();
    await productPage.expectSwal(...messages.product.compareOk);
  });

  test('PDP-08 abas do produto (variação two) devem alternar o conteúdo', { tag: '@regressao' }, async ({ page, productPage }) => {
    await productPage.open(1, 'two');
    await productPage.additionalInfoTab.click();
    await expect(page.getByText('400 g')).toBeVisible();

    await productPage.reviewTab.click();
    await expect(page.getByText('Sara Anela').first()).toBeVisible();

    await productPage.descriptionTab.click();
    await expect(page.getByText('400 g')).toBeHidden();
  });
});
