import { test, expect } from '../../fixtures/auth.fixture';
import { messages } from '../../fixtures/test-data';

test.describe('Minha conta (usuário autenticado)', () => {
  test('ACC-01 deve exibir o e-mail do usuário e a opção de logout', { tag: ['@smoke', '@regressao'] }, async ({ loggedInUser, myAccountPage }) => {
    await expect(myAccountPage.userEmail(loggedInUser.email)).toBeVisible();
    await expect(myAccountPage.logoutLink).toBeVisible();
    await expect(myAccountPage.totalOrders).toBeVisible();
  });

  test('ACC-02 deve encerrar a sessão ao clicar em Logout', { tag: ['@smoke', '@regressao'] }, async ({ page, loggedInUser, myAccountPage, loginPage }) => {
    await myAccountPage.logout();
    await myAccountPage.expectSwal(messages.logout.title, messages.logout.text);
    await expect(page).toHaveURL(/\/login$/);
    await myAccountPage.dismissSwal();
    await expect(loginPage.heading).toBeVisible();
    await expect(myAccountPage.userEmail(loggedInUser.email)).toHaveCount(0);
  });

  test('ACC-03 deve navegar entre as abas do dashboard', { tag: '@regressao' }, async ({ page, loggedInUser, myAccountPage }) => {
    await myAccountPage.ordersTab.click();
    await expect(page).toHaveURL(/\/my-account\/customer-order$/);
    await expect(page.getByRole('cell', { name: 'Completed' })).toBeVisible();

    await myAccountPage.downloadsTab.click();
    await expect(page).toHaveURL(/\/my-account\/customer-download$/);
    await expect(page.getByText('Download Invoices')).toBeVisible();

    await myAccountPage.addressesTab.click();
    await expect(page).toHaveURL(/\/my-account\/customer-address$/);
    await expect(page.getByText('Billing Address')).toBeVisible();

    await myAccountPage.accountDetailsTab.click();
    await expect(page).toHaveURL(/\/my-account\/customer-account-details$/);
    await expect(page.locator('input[name="first-name"]')).toBeVisible();

    await myAccountPage.dashboardTab.click();
    await expect(myAccountPage.userEmail(loggedInUser.email)).toBeVisible();
  });

  test('ACC-05 não deve exibir dados do usuário ao voltar no navegador após logout', { tag: '@regressao' }, async ({ page, loggedInUser, myAccountPage }) => {
    await myAccountPage.logout();
    await expect(page).toHaveURL(/\/login$/);
    await myAccountPage.dismissSwal();

    await page.goBack();
    await expect(page).toHaveURL(/\/my-account$/);
    await expect(myAccountPage.userEmail(loggedInUser.email)).toHaveCount(0);
    await expect(myAccountPage.logoutLink).toHaveCount(0);
  });

  test('ACC-06 deve manter a sessão após recarregar a página (storageState)', { tag: '@regressao' }, async ({ page, context, loggedInUser, myAccountPage }) => {
    // BUG: session lives only in memory; storageState is empty and reload logs the user out.
    test.fail();
    const state = await context.storageState();
    const hasSession = state.cookies.length > 0 || state.origins.some((o) => o.localStorage.length > 0);
    expect(hasSession, 'storageState deveria conter a sessão').toBe(true);

    await page.reload();
    await expect(myAccountPage.userEmail(loggedInUser.email)).toBeVisible({ timeout: 5_000 });
  });
});

test.describe('Minha conta (sem autenticação)', () => {
  test('ACC-04 deve redirecionar para o login ao acessar /my-account sem estar logado', { tag: ['@smoke', '@regressao'] }, async ({ page, myAccountPage }) => {
    // BUG: /my-account is publicly reachable and shows the dashboard without login.
    test.fail();
    await myAccountPage.open();
    await expect(page).toHaveURL(/\/login$/, { timeout: 5_000 });
  });
});
