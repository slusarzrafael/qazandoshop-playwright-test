# Testes de Software com Playwright

Projeto de automação de testes E2E para praticar testes de software no site [QAZANDO Shop](https://automationpratice.com.br/), usando Playwright Test.

## Pré-requisitos

- Git
- Node.js 24 ou superior
- Java 17 ou superior (necessário para abrir/gerar o relatório Allure localmente)

## Baixar e executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/slusarzrafael/qazandoshop-playwright-test.git
   ```

2. Entre na pasta do projeto:

   ```bash
   cd qazandoshop-playwright-test
   ```

3. Instale as dependências:

   ```bash
   npm ci
   ```

4. Instale os navegadores usados nos testes:

   ```bash
   npx playwright install chromium firefox webkit
   ```

5. Crie o arquivo de configuração local:

   ```bash
   cp .env.example .env
   ```

   Abra `.env` e informe `USER_EMAIL`, `USER_PASSWORD` (mínimo de 6 caracteres) e `USER_NAME`.

6. Execute os testes:

   ```bash
   npm test
   ```

Cada execução gera resultados Allure em `allure-results/` e o relatório HTML padrão do Playwright em `playwright-report/`.

Para montar e abrir o relatório Allure:

```bash
npm run report:allure:generate
npm run report:allure:open
```

O relatório Allure abre no navegador. No GitHub Actions, baixe o artefato `test-reports-<run_id>` na execução para visualizar `allure-report/index.html`; o diretório `allure-results/` também fica disponível para regenerar o relatório.

Para abrir o relatório HTML padrão do Playwright:

```bash
npm run report
```

No PowerShell do Windows, se os comandos `npm` ou `npx` forem bloqueados pela política de execução, use `npm.cmd` e `npx.cmd`. Para abrir Allure no Windows, confirme que `java -version` mostra Java 17 ou superior.