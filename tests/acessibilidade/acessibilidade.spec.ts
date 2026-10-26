import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/auth.fixture';
import { credentials } from '../../fixtures/test-data';

// BUG: critical axe violations confirmed on the site (see README / summary).
const pages = [
  { name: 'Home', path: '/' },
  { name: 'Login', path: '/login', bug: 'label: inputs #user/#password sem rótulo associado' },
  { name: 'Cadastro', path: '/register', bug: 'label: inputs de nome/e-mail/senha sem rótulo associado' },
  { name: 'Shop', path: '/shop', bug: 'select-name: selects de filtro/ordenação sem nome acessível' },
  { name: 'Produto', path: '/product-details-one/1', bug: 'button-name (−/+), label (quantidade), select-name (tamanho)' },
  { name: 'Carrinho', path: '/cart', bug: 'label: inputs de quantidade sem rótulo' },
  { name: 'Checkout', path: '/checkout-one' },
];

test.describe('Acessibilidade – axe-core', () => {
  for (const { name, path, bug } of pages) {
    test(`A11Y-01 página ${name} não deve ter violações críticas`, { tag: '@a11y' }, async ({ page }, testInfo) => {
      test.fail(!!bug, bug);
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('contentinfo')).toBeVisible();

      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      await testInfo.attach('axe-results', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });

      const critical = results.violations
        .filter((v) => v.impact === 'critical')
        .map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
      expect(critical, 'violações críticas de acessibilidade').toEqual([]);
    });
  }
});

test.describe('Acessibilidade – teclado e semântica', () => {
  test('A11Y-02 controles do login devem ser operáveis pelo teclado', { tag: '@a11y' }, async ({ page, loginPage, browserName }) => {
    await loginPage.open();
    await loginPage.emailInput.focus();
    const expected = [loginPage.passwordInput, loginPage.loginButton, loginPage.rememberMe];
    for (const target of expected) {
      await page.keyboard.press('Tab');
      await expect(target).toBeFocused();
    }

    if (browserName === 'webkit') {
      await loginPage.createAccountLink.focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/register$/);
    } else {
      await page.keyboard.press('Tab');
      await expect(loginPage.createAccountLink).toBeFocused();
    }
  });

  test('A11Y-03 alerta deve receber foco no OK e fechar com Esc', { tag: '@a11y' }, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(credentials.email, credentials.password);
    await expect(loginPage.swalOk).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(loginPage.swalPopup).toHaveCount(0);
  });

  test('A11Y-04 campos do login devem ter rótulos associados', { tag: '@a11y' }, async ({ page, loginPage }) => {
    // BUG: <label> elements have no "for" attribute, so inputs have no accessible name.
    test.fail();
    await loginPage.open();
    await expect(page.getByLabel('E-mail')).toBeVisible({ timeout: 3_000 });
    await expect(page.getByLabel('Senha')).toBeVisible({ timeout: 3_000 });
  });

  test('A11Y-05 idioma do documento deve ser pt-BR', { tag: '@a11y' }, async ({ page, loginPage }) => {
    // BUG: <html lang="en"> while the content is in Portuguese.
    test.fail();
    await loginPage.open();
    await expect(page.locator('html')).toHaveAttribute('lang', /^pt/, { timeout: 3_000 });
  });
});
