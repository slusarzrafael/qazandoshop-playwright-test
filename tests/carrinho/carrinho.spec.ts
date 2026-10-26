import { test, expect } from '../../fixtures/auth.fixture';
import { initialState, messages, products } from '../../fixtures/test-data';

test.describe('Carrinho', () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.open();
    await expect(cartPage.rows.first()).toBeVisible();
  });

  test('CRT-01 deve exibir os itens do carrinho e o subtotal', { tag: ['@smoke', '@regressao'] }, async ({ cartPage }) => {
    await expect(cartPage.rows).toHaveCount(initialState.cart.length);
    for (const item of initialState.cart) await expect(cartPage.row(item)).toBeVisible();
    await expect(cartPage.subtotal).toHaveText(initialState.cartSubtotal);
    await expect(cartPage.total).toHaveText(initialState.cartSubtotal);
  });

  test('CRT-02 deve recalcular totais ao alterar a quantidade', { tag: ['@smoke', '@regressao'] }, async ({ cartPage }) => {
    await cartPage.quantity(products.fitFlare.name).fill('3');
    await expect(cartPage.rowTotal(products.fitFlare.name)).toHaveText('$156.00');
    await expect(cartPage.subtotal).toHaveText('$211.00');
    await expect(cartPage.total).toHaveText('$211.00');
  });

  test('CRT-03 deve remover um item e atualizar o subtotal', { tag: '@regressao' }, async ({ cartPage }) => {
    await cartPage.remove(products.fitFlare.name);
    await expect(cartPage.rows).toHaveCount(2);
    await expect(cartPage.row(products.fitFlare.name)).toHaveCount(0);
    await expect(cartPage.subtotal).toHaveText('$55.00');
  });

  test('CRT-04 deve esvaziar o carrinho e exibir o estado vazio', { tag: '@regressao' }, async ({ page, cartPage }) => {
    await cartPage.clearCartButton.click();
    await expect(cartPage.emptyCartHeading).toBeVisible();
    await expect(page.getByText('Sorry Mate... No Item Found Inside Your Cart!')).toBeVisible();
    await expect(cartPage.continueShoppingLink).toHaveAttribute('href', '/shop');
  });

  test('CRT-05 deve rejeitar cupom inválido', { tag: '@regressao' }, async ({ cartPage }) => {
    await cartPage.applyCoupon('XPTO');
    await cartPage.expectSwal(...messages.cart.invalidCoupon);
  });

  for (const qty of ['0', '-1']) {
    test(`CRT-06 não deve aceitar quantidade "${qty}"`, { tag: '@regressao' }, async ({ cartPage }) => {
      // BUG: quantity 0 / negative is accepted and produces a wrong subtotal (-1 => $3.00).
      test.fail();
      const input = cartPage.quantity(products.fitFlare.name);
      await input.fill(qty);
      await input.blur();
      await expect(input).toHaveValue('1', { timeout: 3_000 });
      await expect(cartPage.subtotal).toHaveText(initialState.cartSubtotal, { timeout: 3_000 });
    });
  }

  test('CRT-07 deve exibir feedback ao aplicar cupom vazio', { tag: '@regressao' }, async ({ cartPage }) => {
    // BUG: clicking "Apply coupon" with an empty field gives no feedback at all.
    test.fail();
    await cartPage.applyCouponButton.click();
    await expect(cartPage.swalPopup).toBeVisible({ timeout: 3_000 });
  });

  test('CRT-08 deve seguir para o checkout', { tag: ['@smoke', '@regressao'] }, async ({ page, cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckoutLink.click();
    await expect(page).toHaveURL(/\/checkout-one$/);
    await expect(checkoutPage.firstName).toBeVisible();
  });
});

test.describe('Carrinho – fluxos integrados', () => {
  test('CRT-09 produto adicionado na página de detalhe deve aparecer no carrinho', { tag: ['@smoke', '@regressao'] }, async ({ page, productPage, cartPage }) => {
    await productPage.open(products.tShirt.id);
    await productPage.addToCart();
    await productPage.expectSwal(...messages.product.cartOk);
    await productPage.dismissSwal();

    // State is in memory only: navigate inside the SPA instead of page.goto.
    await productPage.goViaFooter('Cart View One');
    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartPage.row(products.tShirt.name)).toBeVisible();
    await expect(cartPage.rows).toHaveCount(4);
    await expect(cartPage.subtotal).toHaveText('$179.00');
  });

  test('CRT-10 carrinho lateral deve remover item e atualizar subtotal e contador', { tag: '@regressao' }, async ({ homePage }) => {
    await homePage.open();
    await homePage.openCartOffcanvas();
    const items = homePage.cartOffcanvas.locator('.offcanvas-wishlist-item-link');
    await expect(items).toHaveCount(3);
    await expect(homePage.cartOffcanvas).toContainText(initialState.cartSubtotal);

    await homePage.cartOffcanvas.locator('.offcanvas-wishlist-item-delete').first().click();
    await expect(items).toHaveCount(2);
    await expect(homePage.cartOffcanvas).toContainText('$55.00');
    await expect(homePage.cartBadge).toHaveText('2');

    await homePage.cartOffcanvas.locator('button.offcanvas-close').click();
    await expect(homePage.cartOffcanvas).not.toBeInViewport({ ratio: 0.5 });
  });

  test('CRT-11 carrinho lateral deve fechar com a tecla Esc', { tag: ['@regressao', '@a11y'] }, async ({ page, homePage }) => {
    // BUG: offcanvas panels ignore the Escape key.
    test.fail();
    await homePage.open();
    await homePage.openCartOffcanvas();
    await page.keyboard.press('Escape');
    await expect(homePage.cartOffcanvas).not.toBeInViewport({ ratio: 0.5, timeout: 3_000 });
  });
});
