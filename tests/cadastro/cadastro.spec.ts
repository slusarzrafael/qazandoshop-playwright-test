import { test, expect } from '../../fixtures/auth.fixture';
import { credentials, invalidEmails, messages, uniqueEmail } from '../../fixtures/test-data';

test.describe('Cadastro de usuário', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.open();
    await expect(registerPage.heading).toBeVisible();
  });

  test('REG-01 deve cadastrar usuário com dados válidos e redirecionar para Minha Conta', { tag: ['@smoke', '@regressao'] }, async ({ page, registerPage }) => {
    await registerPage.register(credentials.name, uniqueEmail(), credentials.password);

    await registerPage.expectSwal(messages.register.successTitle, messages.register.successText(credentials.name));
    await expect(page).toHaveURL(/\/my-account$/);
  });

  test('REG-02 deve exigir o nome', { tag: '@regressao' }, async ({ registerPage }) => {
    await registerPage.register('', uniqueEmail(), credentials.password);
    await expect(registerPage.errorMessage).toHaveText(messages.register.nameRequired);
  });

  test('REG-03 deve exigir o e-mail', { tag: '@regressao' }, async ({ registerPage }) => {
    await registerPage.register(credentials.name, '', credentials.password);
    await expect(registerPage.errorMessage).toHaveText(messages.register.emailInvalid);
  });

  for (const email of invalidEmails) {
    test(`REG-04 deve rejeitar e-mail inválido "${email}"`, { tag: '@regressao' }, async ({ registerPage }) => {
      await registerPage.register(credentials.name, email, credentials.password);
      await expect(registerPage.errorMessage).toHaveText(messages.register.emailInvalid);
    });
  }

  test('REG-05 deve exigir a senha', { tag: '@regressao' }, async ({ registerPage }) => {
    await registerPage.register(credentials.name, uniqueEmail(), '');
    await expect(registerPage.errorMessage).toHaveText(messages.register.passwordShort);
  });

  test('REG-06 deve validar o tamanho mínimo da senha (5 rejeita, 6 aceita)', { tag: '@regressao' }, async ({ registerPage }) => {
    await registerPage.register(credentials.name, uniqueEmail(), '12345');
    await expect(registerPage.errorMessage).toHaveText(messages.register.passwordShort);

    await registerPage.passwordInput.fill('123456');
    await registerPage.registerButton.click();
    await registerPage.expectSwal(messages.register.successTitle);
  });

  test('REG-07 deve exibir nome com HTML escapado, sem executar script', { tag: '@regressao' }, async ({ page, registerPage }) => {
    const payload = '<img src=x onerror=alert(1)><b>Neg</b>';
    let dialogOpened = false;
    page.on('dialog', async (dialog) => {
      dialogOpened = true;
      await dialog.dismiss();
    });

    await registerPage.register(payload, uniqueEmail(), credentials.password);

    await registerPage.expectSwal(messages.register.successTitle, messages.register.successText(payload));
    await expect(registerPage.swalText.locator('b, img')).toHaveCount(0);
    expect(dialogOpened).toBe(false);
  });

  test('REG-08 deve aceitar nome e senha com 300 caracteres', { tag: '@regressao' }, async ({ registerPage }) => {
    await registerPage.register('N'.repeat(300), uniqueEmail(), '1'.repeat(300));
    await registerPage.expectSwal(messages.register.successTitle);
  });

  test('REG-09 deve recusar cadastro com e-mail já cadastrado', { tag: '@regressao' }, async ({ registerPage }) => {
    // BUG: there is no backend; the same e-mail can be registered any number of times.
    test.fail();
    const email = uniqueEmail();
    await registerPage.register(credentials.name, email, credentials.password);
    await registerPage.expectSwal(messages.register.successTitle);

    await registerPage.open();
    await registerPage.register(credentials.name, email, credentials.password);
    await expect(registerPage.swalTitle).not.toHaveText(messages.register.successTitle, { timeout: 3_000 });
  });

  test('REG-10 deve limpar mensagens de erro antigas ao revalidar o formulário', { tag: '@regressao' }, async ({ registerPage }) => {
    // BUG: the previous password error stays on screen when the name error is raised.
    test.fail();
    await registerPage.register(credentials.name, uniqueEmail(), '');
    await expect(registerPage.errorMessage).toHaveText(messages.register.passwordShort);

    await registerPage.nameInput.fill('');
    await registerPage.passwordInput.fill(credentials.password);
    await registerPage.registerButton.click();
    await expect(registerPage.errorMessage).toHaveText([messages.register.nameRequired], { timeout: 3_000 });
  });

  test('REG-11 mensagens de validação devem estar escritas corretamente', { tag: '@regressao' }, async ({ registerPage }) => {
    // BUG: typo "prenchido" instead of "preenchido".
    test.fail();
    await registerPage.registerButton.click();
    await expect(registerPage.errorMessage).toHaveText('O campo nome deve ser preenchido', { timeout: 3_000 });
  });
});
