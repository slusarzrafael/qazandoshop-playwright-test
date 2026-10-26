import { test, expect } from '../../fixtures/auth.fixture';
import { billing, initialState, messages } from '../../fixtures/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ checkoutPage }) => {
    await checkoutPage.open();
    await expect(checkoutPage.firstName).toBeVisible();
  });

  test('CHK-01 deve concluir o pedido com dados válidos', { tag: ['@smoke', '@regressao'] }, async ({ checkoutPage }) => {
    await checkoutPage.fillBilling(billing);
    await checkoutPage.saveButton.click();
    await expect(checkoutPage.errorMessages).toHaveCount(0);

    await checkoutPage.placeOrderButton.click();
    await expect(checkoutPage.successHeading).toBeVisible();
    await expect(checkoutPage.successMessage).toBeVisible();
  });

  test('CHK-02 deve exibir todas as mensagens de campos obrigatórios', { tag: '@regressao' }, async ({ checkoutPage }) => {
    await checkoutPage.saveButton.click();
    await expect(checkoutPage.errorMessages).toHaveText([...messages.checkout.required]);
  });

  test('CHK-03 deve rejeitar e-mail inválido', { tag: '@regressao' }, async ({ checkoutPage }) => {
    await checkoutPage.fillBilling({ ...billing, email: 'emailinvalido' });
    await checkoutPage.saveButton.click();
    await expect(checkoutPage.errorMessages).toHaveText([messages.checkout.emailInvalid]);
  });

  test('CHK-04 não deve finalizar pedido sem salvar os dados de cobrança', { tag: '@regressao' }, async ({ checkoutPage }) => {
    await checkoutPage.fillBilling(billing);
    await checkoutPage.placeOrderButton.click();
    await expect(checkoutPage.errorMessages).toHaveText([messages.checkout.paymentRequired]);
    await expect(checkoutPage.successHeading).toBeHidden();
  });

  test('CHK-05 deve permitir escolher o método de pagamento', { tag: '@regressao' }, async ({ checkoutPage }) => {
    await expect(checkoutPage.bankTransferRadio).toBeChecked();

    await checkoutPage.selectPayment('css');
    await expect(checkoutPage.paypalRadio).toBeChecked();
    await expect(checkoutPage.bankTransferRadio).not.toBeChecked();

    await checkoutPage.selectPayment('javascript');
    await expect(checkoutPage.mobileBankingRadio).toBeChecked();
  });

  test('CHK-06 resumo do pedido deve refletir os itens do carrinho', { tag: '@regressao' }, async ({ checkoutPage }) => {
    // BUG: "Your Orders" is hard-coded (Blue Dress, Tuxedo...) and ignores the cart contents.
    test.fail();
    for (const item of initialState.cart) {
      await expect(checkoutPage.ordersSummary).toContainText(item, { timeout: 3_000 });
    }
  });
});

test.describe('Checkout – variação two', () => {
  test('CHK-07 deve bloquear "Proceed to Pay" com campos obrigatórios vazios', { tag: '@regressao' }, async ({ page, checkoutPage }) => {
    await checkoutPage.goto('/checkout-two');
    await page.getByRole('button', { name: 'Proceed to Pay' }).click();
    await expect(page).toHaveURL(/\/checkout-two$/);
    await expect(page.locator('input:invalid').first()).toBeAttached();
    await checkoutPage.expectNoSwal();
  });
});
