import { test, expect } from '../../fixtures/auth.fixture';
import { contact, messages, uniqueEmail } from '../../fixtures/test-data';

test.describe('Rastreio de pedido', () => {
  test.beforeEach(async ({ orderTrackingPage }) => {
    await orderTrackingPage.open();
    await expect(orderTrackingPage.orderId).toBeVisible();
  });

  test('TRK-01 deve rastrear pedido e exibir confirmação', { tag: '@regressao' }, async ({ page, orderTrackingPage }) => {
    await orderTrackingPage.track('12345', 'cliente@teste.com');
    await expect(page).toHaveURL(/\/order-complete$/);
    await expect(orderTrackingPage.completeHeading).toBeVisible();
  });

  test('TRK-02 deve bloquear envio com campos vazios', { tag: '@regressao' }, async ({ page, orderTrackingPage }) => {
    await orderTrackingPage.trackButton.click();
    await expect(page).toHaveURL(/\/order-tracking$/);
    expect(await orderTrackingPage.isValid(orderTrackingPage.orderId)).toBe(false);
    expect(await orderTrackingPage.isValid(orderTrackingPage.billingEmail)).toBe(false);
  });

  test('TRK-03 deve rejeitar e-mail de cobrança inválido', { tag: '@regressao' }, async ({ page, orderTrackingPage }) => {
    // BUG: Billing Email is type="text" without validation; invalid e-mail is accepted.
    test.fail();
    await orderTrackingPage.track('12345', 'invalido');
    await expect(page).toHaveURL(/\/order-tracking$/, { timeout: 3_000 });
  });
});

test.describe('Contato', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.open();
    await expect(contactPage.heading).toBeVisible();
  });

  test('CNT-01 deve enviar mensagem com dados válidos', { tag: '@regressao' }, async ({ contactPage }) => {
    await contactPage.send(contact);
    await contactPage.expectSwal(...messages.contact);
  });

  test('CNT-02 não deve enviar com campos vazios', { tag: '@regressao' }, async ({ contactPage }) => {
    await contactPage.submitButton.click();
    await contactPage.expectNoSwal();
  });

  test('CNT-03 deve rejeitar e-mail inválido', { tag: '@regressao' }, async ({ contactPage }) => {
    // BUG: e-mail field is type="text" and any value is accepted.
    test.fail();
    await contactPage.send({ ...contact, email: 'invalido' });
    await contactPage.expectNoSwal();
  });
});

test.describe('Newsletter', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await expect(homePage.newsletterInput).toBeVisible();
  });

  test('NWS-01 deve inscrever e-mail válido', { tag: '@regressao' }, async ({ homePage }) => {
    await homePage.subscribeNewsletter(uniqueEmail());
    await homePage.expectSwal(...messages.newsletter);
  });

  for (const email of ['', 'invalido']) {
    test(`NWS-02 deve bloquear e-mail "${email || '(vazio)'}" com validação nativa`, { tag: '@regressao' }, async ({ homePage }) => {
      await homePage.subscribeNewsletter(email);
      expect(await homePage.isValid(homePage.newsletterInput)).toBe(false);
      await homePage.expectNoSwal();
    });
  }
});

test.describe('FAQ', () => {
  test('FAQ-01 deve expandir a pergunta selecionada e recolher a anterior', { tag: '@regressao' }, async ({ faqPage }) => {
    await faqPage.open();
    await expect(faqPage.panel(0)).toHaveClass(/show/);

    await faqPage.question('4 Tips for A Colorful Easter Tablescape').click();
    await expect(faqPage.panel(1)).toHaveClass(/show/);
    await expect(faqPage.panel(0)).not.toHaveClass(/show/);
  });
});
