import { test, expect } from '../../fixtures/auth.fixture';
import { credentials, invalidEmails, messages } from '../../fixtures/test-data';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await expect(loginPage.heading).toBeVisible();
  });

  test('LOG-01 deve autenticar com credenciais válidas e redirecionar para Minha Conta', { tag: ['@smoke', '@regressao'] }, async ({ page, loginPage, myAccountPage }) => {
    await loginPage.login(credentials.email, credentials.password);

    await loginPage.expectSwal(messages.login.successTitle, messages.login.successText(credentials.email));
    await expect(page).toHaveURL(/\/my-account$/);
    await loginPage.dismissSwal();
    await expect(myAccountPage.userEmail(credentials.email)).toBeVisible();
  });

  test('LOG-02 deve exibir erro de e-mail ao enviar campos vazios', { tag: '@regressao' }, async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toHaveText(messages.login.invalidEmail);
  });

  for (const email of invalidEmails) {
    test(`LOG-03 deve rejeitar e-mail com formato inválido "${email}"`, { tag: '@regressao' }, async ({ page, loginPage }) => {
      await loginPage.login(email, credentials.password);
      await expect(loginPage.errorMessage).toHaveText(messages.login.invalidEmail);
      await expect(page).toHaveURL(/\/login$/);
    });
  }

  test('LOG-04 deve exibir erro de senha quando a senha estiver vazia', { tag: '@regressao' }, async ({ loginPage }) => {
    await loginPage.login(credentials.email, '');
    await expect(loginPage.errorMessage).toHaveText(messages.login.invalidPassword);
  });

  test('LOG-05 deve rejeitar senha com 5 caracteres (abaixo do mínimo)', { tag: '@regressao' }, async ({ loginPage }) => {
    await loginPage.login(credentials.email, '12345');
    await expect(loginPage.errorMessage).toHaveText(messages.login.invalidPassword);
  });

  test('LOG-06 deve aceitar senha com exatamente 6 caracteres (limite mínimo)', { tag: '@regressao' }, async ({ page, loginPage }) => {
    await loginPage.login(credentials.email, '123456');
    await loginPage.expectSwal(messages.login.successTitle);
    await expect(page).toHaveURL(/\/my-account$/);
  });

  test('LOG-07 deve rejeitar e-mail com espaços nas extremidades', { tag: '@regressao' }, async ({ loginPage }) => {
    await loginPage.login(`  ${credentials.email}  `, credentials.password);
    await expect(loginPage.errorMessage).toHaveText(messages.login.invalidEmail);
  });

  test('LOG-08 deve levar ao cadastro pelo link "Ainda não tem conta?"', { tag: '@regressao' }, async ({ page, loginPage, registerPage }) => {
    await loginPage.createAccountLink.click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(registerPage.heading).toBeVisible();
  });

  test('LOG-09 deve enviar o login ao pressionar Enter com foco no botão', { tag: '@regressao' }, async ({ page, loginPage }) => {
    await loginPage.fill(credentials.email, credentials.password);
    await loginPage.loginButton.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/my-account$/);
  });

  test('LOG-10 deve enviar o login ao pressionar Enter no campo senha', { tag: '@regressao' }, async ({ page, loginPage }) => {
    // BUG: inputs are not wrapped in a <form>, so Enter in the password field does nothing.
    test.fail();
    await loginPage.fill(credentials.email, credentials.password);
    await loginPage.passwordInput.press('Enter');
    await expect(page).toHaveURL(/\/my-account$/, { timeout: 5_000 });
  });

  test('LOG-11 não deve disparar requisições de API ao autenticar (autenticação 100% client-side)', { tag: '@regressao' }, async ({ page, loginPage }) => {
    const apiCalls: string[] = [];
    page.on('request', (req) => {
      if (['xhr', 'fetch'].includes(req.resourceType())) apiCalls.push(`${req.method()} ${req.url()}`);
    });
    await loginPage.login(credentials.email, credentials.password);
    await expect(page).toHaveURL(/\/my-account$/);
    expect(apiCalls).toEqual([]);
  });

  test('LOG-12 "Lembrar de mim" deve manter a sessão após recarregar a página', { tag: '@regressao' }, async ({ page, loginPage, myAccountPage }) => {
    // BUG: nothing is stored in cookies/localStorage/sessionStorage; reload drops the session.
    test.fail();
    await loginPage.rememberMe.check();
    await loginPage.login(credentials.email, credentials.password);
    await expect(page).toHaveURL(/\/my-account$/);
    await loginPage.dismissSwal();
    await page.reload();
    await expect(myAccountPage.userEmail(credentials.email)).toBeVisible({ timeout: 5_000 });
  });
});
