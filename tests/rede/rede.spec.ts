import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures/auth.fixture';
import { billing, credentials, messages, products, uniqueEmail } from '../../fixtures/test-data';

const CHUNKS = '**/static/js/*.chunk.js';
const isMainChunk = (url: string) => url.includes('/static/js/main.');

function trackApiCalls(page: Page) {
  const calls: string[] = [];
  page.on('request', (req) => {
    if (['xhr', 'fetch'].includes(req.resourceType())) calls.push(`${req.method()} ${req.url()}`);
  });
  return calls;
}

test.describe('Rede – interceptação com page.route()', () => {
  test('NET-01 deve exibir mensagem amigável quando o script da página falhar (HTTP 500)', { tag: '@regressao' }, async ({ page, homePage }) => {
    // BUG: no error boundary — a failed lazy chunk leaves the screen blank.
    test.fail();
    await homePage.open();
    await expect(homePage.topProductHeading).toBeVisible();

    await page.route(CHUNKS, (route) =>
      isMainChunk(route.request().url()) ? route.continue() : route.fulfill({ status: 500, body: '' }),
    );
    await homePage.topLoginLink.click();
    await expect(page.getByText(/erro|error|tente novamente|try again/i).first()).toBeVisible({ timeout: 5_000 });
  });

  test('NET-01 falha (HTTP 500) no script da rota não deve renderizar o formulário', { tag: '@regressao' }, async ({ page, homePage, loginPage }) => {
    await homePage.open();
    await expect(homePage.topProductHeading).toBeVisible();

    const failed = page.waitForResponse((r) => r.url().includes('.chunk.js') && r.status() === 500);
    await page.route(CHUNKS, (route) =>
      isMainChunk(route.request().url()) ? route.continue() : route.fulfill({ status: 500, body: '' }),
    );
    await homePage.topLoginLink.click();
    await failed;
    await expect(loginPage.loginButton).toHaveCount(0);
  });

  test('NET-02 página deve carregar mesmo com scripts lentos (2s de atraso)', { tag: '@regressao' }, async ({ page, loginPage }) => {
    await page.route(CHUNKS, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      await route.continue();
    });
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible({ timeout: 20_000 });
    await loginPage.login(credentials.email, credentials.password);
    await expect(page).toHaveURL(/\/my-account$/);
  });

  test('NET-03 imagens com 404 não devem impedir a compra', { tag: '@regressao' }, async ({ page, productPage }) => {
    await page.route(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/, (route) => route.fulfill({ status: 404, body: '' }));
    await productPage.open(products.tShirt.id);
    await expect(productPage.heading(products.tShirt.name)).toBeVisible();
    await productPage.addToCart();
    await productPage.expectSwal(...messages.product.cartOk);
    await expect(productPage.cartBadge).toHaveText('4');
  });

  test('NET-04 indisponibilidade do Google Fonts não deve impedir o login', { tag: '@regressao' }, async ({ page, loginPage }) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort('timedout'));
    await loginPage.open();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectSwal(messages.login.successTitle);
    await expect(page).toHaveURL(/\/my-account$/);
  });

  test('NET-05 cadastro e checkout não devem disparar requisições XHR/fetch', { tag: '@regressao' }, async ({ page, registerPage, checkoutPage }) => {
    const calls = trackApiCalls(page);

    await registerPage.open();
    await registerPage.register(credentials.name, uniqueEmail(), credentials.password);
    await registerPage.expectSwal(messages.register.successTitle);

    await checkoutPage.open();
    await checkoutPage.fillBilling(billing);
    await checkoutPage.saveButton.click();
    await checkoutPage.placeOrderButton.click();
    await expect(checkoutPage.successHeading).toBeVisible();

    expect(calls).toEqual([]);
  });
});
