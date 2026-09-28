# Estratégia de Testes

Esta documentação define a estratégia, as diretrizes e as convenções oficiais de testes para o ecossistema frontend do projeto. O objetivo é garantir previsibilidade, alta confiança nas entregas, acessibilidade em primeiro lugar e eficiência no onboarding de novos desenvolvedores.

---

## 1. Visão Geral e Tabela Resumo

Adotamos uma divisão clara entre testes rápidos rodando em ambiente emulado (Node + jsdom via **Vitest**) e testes de caixa-preta rodando em navegadores reais (via **Playwright**).

| Tipo de Teste                   | Extensão     | Ferramenta         | Localização         | Foco Principal / O que testar                   |
| :------------------------------ | :----------- | :----------------- | :------------------ | :---------------------------------------------- |
| **Unitário**                    | `*.test.ts`  | Vitest             | Co-located          | Funções utilitárias (`libs/`) e reducers puros. |
| **Hook**                        | `*.test.ts`  | Vitest + RTL       | Co-located          | Comportamento de hooks customizados (`hooks/`). |
| **Componente (Base/Composite)** | `*.test.tsx` | Vitest + RTL       | Co-located          | Acessibilidade, estados HeroUI e props locais.  |
| **Integração (Widget/State)**   | `*.test.tsx` | Vitest + RTL + MSW | Co-located          | Integração UI ↔ Redux e mocks de API com MSW.   |
| **Páginas (Wiring Local)**      | `*.test.tsx` | Vitest + RTL       | Co-located          | Composição de múltiplos widgets e Hydration.    |
| **End-to-End (E2E)**            | `*.spec.ts`  | Playwright         | `e2e/specs/` (Raiz) | Jornadas críticas do SaaS e fluxos reais.       |

---

## 2. Diferenciação de Extensões (Nomenclatura)

- **`*.test.ts(x)`**: Exclusivo para testes executados via **Vitest**.
  - _Motivo_: Rodam sobre Node.js com o ambiente emulado jsdom. São rápidos, paralelizados por padrão e ideais para testar lógica isolada, renderização de componentes e integrações com o Redux local.
- **`*.spec.ts(x)`**: Exclusivo para testes executados via **Playwright**.
  - _Motivo_: Rodam em instâncias reais de navegadores (Chromium, Firefox, WebKit). Testam fluxos de negócio reais, renderização final, integrações de rede reais e cenários reais de interação do usuário final.

---

## 3. Mapeamento por Camadas de UI e Estado

### 3.1. `src/components/base` e `composites`

- **Foco**: Acessibilidade (regras WAI-ARIA, `aria-label`, estados semânticos de foco), variações de propriedades (variants, cores, sizes) fornecidas pelo HeroUI e callbacks de interação simples (ex: `onClick`).
- **Abordagem**: Testar comportamento e semântica com `@testing-library/react`. **Evitar** testar estilos CSS ou classes Tailwind diretamente, focando em atributos acessíveis e visibilidade.

### 3.2. `src/components/widgets`

- **Foco**: Exibição de dados mockados e interações com o estado Redux. Os widgets encapsulam blocos lógicos como tabelas de dados, formulários de edição e linhas de KPIs.
- **Abordagem**: Utilizar o helper `renderWithProviders` para envolver o componente no `Provider` do Redux e mocar as respostas de API com o **MSW (Mock Service Worker)**.
- **Garantia**: Certificar-se de que os loaders aparecem durante o fetch, que erros de API são exibidos corretamente na tela, e que o estado local e global são atualizados corretamente.

### 3.3. `src/components/pages`

- **Foco**: Acoplamento e wiring local de templates e widgets.
- **Abordagem**: Podem ser testadas via testes de integração simulados no Vitest ou por testes E2E com Playwright focando em fluxos mais amplos da tela.

### 3.4. `src/store` (RTK Query)

- **Foco**: Integração de requisições, sincronização de cache e side-effects.
- **Regra Absoluta**: **É estritamente proibido realizar chamadas HTTP reais** para APIs externas nos testes executados pelo Vitest. Toda comunicação de rede deve ser interceptada pelo MSW.
- **Helper Obrigatório**: Todo teste que envolve RTK Query ou Redux deve utilizar o helper `renderWithProviders`. Ele instancia uma store limpa para o teste atual e limpa explicitamente o cache do RTK Query antes da renderização usando `api.util.resetApiState()`.

---

## 4. Estrutura de Arquivos e Co-location

### 4.1. Princípio de Co-location (Vitest)

Todos os testes unitários, de componentes e de widgets devem residir **exatamente na mesma pasta** que o arquivo original sob teste. Isso aumenta a visibilidade da cobertura de testes e facilita a refatoração do código.

```txt
src/components/composites/user-card/
├── user-card.tsx
├── user-card.types.ts
├── user-card.test.tsx      <-- Arquivo de teste unitário/componente
└── index.ts
```

### 4.2. Isolamento de E2E (Playwright)

Os testes de ponta a ponta ficam isolados na raiz do projeto na pasta `e2e/`, divididos de forma clara para manter a organização dos testes e a reaproveitabilidade do código através do padrão **Page Object Model (POM)**:

```txt
e2e/
├── page-objects/          <-- Classes que mapeiam a estrutura das páginas
│   ├── login-page.ts
│   └── employee-page.ts
└── specs/                 <-- Casos de teste funcionais E2E
    ├── auth.spec.ts
    └── employee.spec.ts
```

---

## 5. Metodologia AAA (Arrange, Act, Assert)

Para maximizar a legibilidade e a manutenção dos testes por qualquer membro do time, adotamos a estrutura metodológica AAA. Cada teste deve dividir seu escopo visualmente através destas três etapas essenciais, separadas por uma linha em branco:

- **Arrange (Organizar)**: Configuração inicial do cenário. É onde definimos variáveis de entrada, criamos dados mockados, instanciamos espiões (vi.fn()) ou renderizamos os componentes sob teste.

- **Act (Agir)**: Execução precisa do comportamento que se deseja testar. Corresponde à chamada de uma função pura, simulação de um evento de clique ou interação direta do usuário na UI.

- **Assert (Asserir/Verificar)**: O momento da validação. Aqui são concentradas as asserções (expect) que garantem que o resultado obtido reflete o comportamento esperado da aplicação.

## 6. Exemplos Práticos de Código

### 6.1. Teste Unitário (Hook/Lib) com Vitest

Para testar utilitários puros ou hooks customizados sem estado global:

```typescript
// src/libs/formatters.test.ts
import { describe, expect, it } from 'vitest';

import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format numbers to Brazilian Real currency format', () => {
    // Arrange
    const valueToFormat = 1500.5;

    // Act
    const result = formatCurrency(valueToFormat);
    const sanitizedResult = result.replace(/\u00a0/g, ' ');

    // Assert
    expect(sanitizedResult).toBe('R$ 1.500,50');
  });

  it('should return R$ 0,00 for zero values', () => {
    // Arrange
    const valueToFormat = 0;

    // Act
    const result = formatCurrency(valueToFormat);
    const sanitizedResult = result.replace(/\u00a0/g, ' ');

    // Assert
    expect(sanitizedResult).toBe('R$ 0,00');
  });
});
```

### 6.2. Teste de Componente (Composite/Base) com Vitest + RTL

Foco em acessibilidade e interações em componentes sem dependência de estado global:

```typescript
// src/components/composites/alert-banner/alert-banner.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AlertBanner } from './alert-banner';

describe('AlertBanner', () => {
  it('renders correctly with message and triggers dismiss callback', () => {
    // Arrange
    const handleDismiss = vi.fn();
    const alertMessage = "Atenção: A sua assinatura expira em 3 dias.";

    render(
      <AlertBanner message="{alertMessage}" onDismiss="{handleDismiss}"/>
    );

    // Act
    const closeButton = screen.getByRole('button', { name: /fechar alerta/i });
    fireEvent.click(closeButton);

    // Assert
    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(screen.getByText(/A sua assinatura expira em 3 dias/i)).toBeDefined();
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
```

### 6.3. Teste de Integração (Widget + RTK Query + MSW)

Este exemplo mostra o uso do helper `renderWithProviders` com o MSW interceptando chamadas HTTP para isolar testes de integração:

```typescript
// src/components/widgets/employee-list/employee-list.test.tsx
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils';
import { EmployeeList } from './employee-list';

// Configuração dos Handlers do Mock Service Worker (MSW)
const handlers = [
  http.get('*/api/employees', () => {
    return HttpResponse.json([
      { id: '1', name: 'Ana Silva', role: 'Developer' },
      { id: '2', name: 'Bruno Costa', role: 'Designer' },
    ]);
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('EmployeeList Widget', () => {
  it('renders employee items successfully after data fetching', async () => {
    // Arrange
    renderWithProviders(<EmployeeList/>);

    // Act & Assert (Lógica Reativa / Assíncrona)
    // Assert Inicial: Garante o estado visual de carregamento pendente imediatamente
    expect(screen.getByLabelText(/carregando funcionários/i)).toBeDefined();

    // Assert Final: Aguarda a resolução dos dados da rede simulada pelo MSW na UI
    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeDefined();
      expect(screen.getByText('Bruno Costa')).toBeDefined();
    });

    expect(screen.queryByLabelText(/carregando funcionários/i)).toBeNull();
  });
});
```

_Nota: Veja abaixo a implementação recomendada de `renderWithProviders` no arquivo auxiliar de testes:_

```typescript
// src/utils/test-utils.tsx
import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, RootState } from '@/store';
import { api } from '@/store/services/api/base-api';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = makeStore(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Regra crítica: limpar o cache do RTK Query antes de cada render
  store.dispatch(api.util.resetApiState());

  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return <Provider store="{store}">{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

---

## 7. Diretrizes do Playwright (E2E)

Os testes E2E do Playwright validam fluxos transversais que garantem o funcionamento de transações cruciais de negócio no SaaS.

### 7.1. Jornadas Críticas

Evite escrever testes E2E para comportamentos simples de UI. Os testes E2E devem validar caminhos como:

- **Autenticação**: Login com MFA, logout, recuperação de conta.
- **Onboarding/Cadastro**: Criação completa de uma conta de cliente ou contratação de colaborador.
- **Cobrança**: Assinatura de plano e checkout.

### 7.2. Localizadores Robustos (Acessibilidade)

- **Proibido**: Usar seletores frágeis baseados em estrutura CSS ou classes que podem mudar a qualquer momento devido à estilização (ex: `page.locator('.btn-primary')` ou `page.locator('#input-name')`).
- **Obrigatório**: Utilizar localizadores baseados em acessibilidade (Aria roles e textos visuais), pois eles garantem que, se o teste passar, a aplicação também continuará acessível para tecnologias assistivas:
  - ✅ `page.getByRole('button', { name: /enviar formulário/i })`
  - ✅ `page.getByLabel('Endereço de E-mail')`
  - ✅ `page.getByText('Cadastro efetuado com sucesso!')`

### 7.3. Configuração de URL

A `baseURL` deve estar declarada no `playwright.config.ts`. Todos os testes devem utilizar URLs relativas para facilitar a mudança de ambientes (local, staging, preview).

- ✅ `await page.goto('/settings')`
- ❌ `await page.goto('http://localhost:3000/settings')`

### 7.4. Exemplo de Padrão Page Object Model (POM)

#### Definição da Classe (Page Object)

```typescript
// e2e/page-objects/login-page.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/endereço de e-mail/i);
    this.passwordInput = page.getByLabel(/senha/i);
    this.submitButton = page.getByRole('button', { name: /entrar/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async submitLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyErrorMessage(message: string) {
    const errorAlert = this.page.getByRole('alert');
    await expect(errorAlert).toContainText(message);
  }
}
```

#### Uso no Teste (Spec)

```typescript
// e2e/specs/auth.spec.ts
import { test } from '@playwright/test';

import { LoginPage } from '../page-objects/login-page';

test.describe('Autenticação de Usuário', () => {
  test('deve exibir erro ao submeter credenciais incorretas', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.submitLoginForm('invalido@empresa.com', 'senha123');
    await loginPage.verifyErrorMessage('Credenciais inválidas');
  });
});
```

---

## 8. Anti-padrões (O que NÃO fazer)

- **❌ Não criar arquivos `.test.ts` fora do local do componente**: Evite criar uma pasta isolada como `tests/unit/components/` para testes do Vitest. Isso viola o princípio de co-location.
- **❌ Não usar seletores de classe CSS nos testes E2E**: Não utilize seletores do tipo `.flex > div > input` ou `.btn-submit` nos specs do Playwright.
- **❌ Não realizar chamadas de rede reais no Vitest**: Qualquer teste unitário/integração que precise de dados de rede deve mockar as APIs usando MSW. Evite o uso de mocks globais do `fetch` ad-hoc se puder interceptar a nível de rede com MSW.
- **❌ Não ignorar o ciclo de limpeza do cache da Store**: Deixar de limpar o estado do RTK Query entre execuções de testes de integração pode causar contaminação de estado silenciosa, gerando falso-positivos ou falso-negativos nos assertions.
- **❌ Não usar E2E para testar todas as variações de propriedades de UI**: Se você quer testar 10 cores diferentes de um botão ou 5 tamanhos de alerta, use testes unitários/componente com Vitest. O Playwright deve ser reservado para fluxos de negócio críticos (evitando lentidão na execução da esteira de CI/CD).

---

## 9. Diretrizes e Boas Práticas da Testing Library

### 9.1. Use seletores baseados no que o usuário vê

Evite testar classes, IDs ou estrutura interna. Foque no conteúdo acessível ao usuário.

```tsx
screen.getByText('Bem-vindo');
screen.getByRole('button', { name: /salvar/i });
screen.getByLabelText('Senha');
```

### 9.2. Prefira `findBy*` para conteúdo assíncrono

Use `findBy` para esperar um elemento aparecer após interações.

```tsx
await screen.findByText('Dados carregados');
```

### 9.3. Use `userEvent` para simular interações

Simula interações reais com foco, delay, teclado e clique.

```tsx
await userEvent.click(screen.getByRole('button', { name: /enviar/i }));
await userEvent.type(screen.getByLabelText('Nome'), 'Otávio');
```

### 9.4. Centralize renderizações comuns

Crie helpers como `renderWithProviders` se usar Context, Theme, Redux, etc.

```tsx
function renderWithTheme(ui) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}
```

### 9.5. Teste o que o usuário esperaria

Verifique mensagens, estados, botões desabilitados, e mudanças visuais.

```tsx
expect(screen.getByText('Erro ao salvar')).toBeInTheDocument();
expect(button).toBeDisabled();
```

---

### 9.6. ❌ Más Práticas – O que evitar ao usar a Testing Library

#### 1. Evite `getByTestId` como padrão

Só use se **não houver outra forma acessível** de selecionar.

```tsx
// Evite:
screen.getByTestId('botao-enviar');
```

#### 2. Não teste classes, estilos ou estrutura interna

Fragiliza o teste. Mudanças no CSS quebram os testes sem necessidade.

```tsx
// Evite:
expect(button).toHaveClass('btn-primary');
```

#### 3. Não use `waitFor` sem real necessidade

Use `waitFor` para condições genéricas, mas prefira `findBy` para elementos.

```tsx
// Menos ideal:
await waitFor(() => {
  expect(screen.getByText('Pronto')).toBeInTheDocument();
});

// Melhor:
await screen.findByText('Pronto');
```

#### 4. Não teste implementação interna

Evite saber de `useState`, `ref`, `context`, etc. Teste comportamentos e efeitos visuais.

```tsx
// Evite:
expect(setStateSpy).toHaveBeenCalled();

// Prefira:
expect(screen.getByText('Contador: 1')).toBeInTheDocument();
```

---

### 9.7. Extras

- **Usar `getByRole` ajuda na acessibilidade**
- **Mock apenas o necessário** (APIs externas, não comportamento interno)
- **Escreva o nome do teste como comportamento do usuário**

```tsx
// Bom:
test('mostra erro ao enviar formulário vazio', () => { ... })

// Ruim:
test('chama handleSubmit com dados vazios', () => { ... })
```

> **Dica final**: "Teste como o usuário usaria. Não como o dev implementou." – Kent C. Dodds

---

### 9.8. Métodos da Testing Library – Resumo rápido

#### 🟩 `getBy*`

- **Sincronamente** busca o elemento.
- Se **não encontrar → lança erro**.
- Ideal quando o elemento já **deveria estar visível.**

```ts
screen.getByText('Enviar');
```

#### 🟦 `findBy*`

- **Assíncrono**, espera o elemento aparecer.
- Útil após cliques, fetchs, animações, etc.
- Internamente usa `waitFor`.

```ts
await screen.findByText('Carregando...');
```

#### 🟥 `queryBy*`

- Retorna `null` se **não encontrar** (sem erro).
- Ideal para testar **que algo não está na tela**.

```ts
expect(screen.queryByText('Erro')).not.toBeInTheDocument();
```

#### 🧭 Ordem de prioridade dos seletores

> Do mais recomendado ao menos recomendado (da perspectiva do usuário):

1. ✅ `getByRole`
2. ✅ `getByLabelText`
3. ✅ `getByPlaceholderText`
4. ✅ `getByText`
5. ✅ `getByDisplayValue`
6. ✅ `getByAltText`
7. ⚠️ `getByTitle`
8. 🚫 `getByTestId` (usar só como último recurso)
