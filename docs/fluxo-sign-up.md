# Documentação do Fluxo da Rota `/sign-up`

## Visão Geral

A rota `/sign-up` é responsável pelo fluxo de cadastro de novos usuários na aplicação. Este documento detalha o funcionamento, os componentes envolvidos e o fluxo de dados, servindo como referência para desenvolvedores que desejam entender ou modificar o processo de registro.

---

## 1. Estrutura da Página

O arquivo principal da rota é `app/(public)/sign-up/page.tsx`. Ele importa e renderiza o componente `RegisterForm` centralizado na tela:

```tsx
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
```

---

## 2. Componente Principal: `RegisterForm`

O componente `RegisterForm` é responsável por todo o fluxo de cadastro, incluindo:

- Exibição do formulário
- Validação dos campos
- Comunicação com a API para criação do usuário
- Autenticação automática após cadastro
- Exibição de mensagens de erro

### 2.1. Estrutura do Formulário

O formulário contém os seguintes campos:

- **Nome** (`name`)
- **Email** (`email`)
- **Senha** (`password`)
- **Confirmação de Senha** (`confirmPassword`)

Além disso, há botões para:

- Submeter o cadastro
- (Placeholder) Login com Google
- Link para a página de login

### 2.2. Validação

A validação é feita com o schema `registerFormSchema` (Zod):

- Nome: mínimo de 3 caracteres
- Email: formato válido
- Senha: mínimo de 6 caracteres
- Confirmação de senha: deve ser igual à senha

Erros de validação são exibidos abaixo dos campos correspondentes.

### 2.3. Submissão e Fluxo de Dados

1. **Validação**: Ao submeter, os dados são validados pelo schema.
2. **Criação do Usuário**: Se válido, chama `createUser` (em `app/api/repositories/user.ts`), que faz um POST para `/user/create`.
3. **Autenticação**: Se o usuário for criado com sucesso, chama `authenticateUser` (em `app/api/repositories/auth.ts`), que faz um POST para `/authentication/login`.
4. **Persistência do Token**: O token retornado é salvo em cookie via `handleAuthentication` (em `lib/auth-utils.ts`) e o usuário é redirecionado para `/home`.
5. **Tratamento de Erros**: Qualquer erro nas etapas acima é capturado e exibido para o usuário.

### 2.4. Componentes de UI Utilizados

- `Card`, `CardHeader`, `CardContent`, `CardTitle`: Estrutura visual do formulário
- `Input`, `Label`: Campos do formulário
- `Button`: Botões de ação
- `Image`: Exibe o logo da aplicação

---

## 3. Fluxo Esperado (Resumo)

1. Usuário acessa `/sign-up`.
2. Preenche os campos obrigatórios.
3. Ao submeter:
   - Validação local dos dados.
   - Se válido, requisição para criar usuário.
   - Se criado, autenticação automática.
   - Token salvo em cookie e redirecionamento para `/home`.
   - Se erro, mensagem exibida ao usuário.

---

## 4. Pontos de Atenção

- O botão "Login with Google" está presente, mas não implementa autenticação social.
- O fluxo depende de respostas específicas da API (`message: ok` para sucesso na criação).
- O token de autenticação é salvo em cookie com expiração de 7 dias.
- O formulário é "client component" (usa hooks do React).

---

## 5. Referências de Código

- Formulário: `components/register-form.tsx`
- Schema de validação: `lib/inputs-validation.ts`
- Criação de usuário: `app/api/repositories/user.ts`
- Autenticação: `app/api/repositories/auth.ts`
- Persistência do token: `lib/auth-utils.ts`

---

## 6. Possíveis Extensões

- Implementar autenticação social (Google, etc.)
- Melhorar feedback visual durante requisições
- Internacionalização dos textos

---

Esta documentação cobre o fluxo completo da rota `/sign-up` e pode ser usada como base para manutenção ou evolução do cadastro de usuários.
