# Documentação do Componente de Formulário de Login

## Visão Geral

O componente `LoginForm` é um componente React do lado do cliente que fornece funcionalidade de autenticação de usuários. Ele renderiza um formulário que permite aos usuários fazerem login na aplicação fornecendo seu email e senha.

## Estrutura do Componente

O componente `LoginForm` é estruturado como um card com um formulário que contém:

- Logo
- Cabeçalho do formulário de login com título e descrição
- Campo de entrada de email
- Campo de entrada de senha com link "Esqueceu sua senha?"
- Exibição de mensagens de erro para erros de validação
- Botão de login
- Botão de login do Google (método alternativo de autenticação)
- Link para a página de cadastro para novos usuários

## Dependências

O componente depende de vários módulos:

- **Componentes UI:**

  - `Button`, `Card`, `Input` e `Label` da biblioteca de componentes UI
  - Componente `Image` do Next.js para exibir o logo

- **Utilidades:**
  - `cn` de `@/lib/utils` para gerenciamento de classes CSS
  - `loginFormSchema` de `@/lib/inputs-validation` para validação de formulário
  - `authenticateUser` de `@/app/api/repositories/auth` para comunicação com a API
  - `handleAuthentication` de `@/lib/auth-utils` para gerenciamento de tokens
  - `useRouter` de `next/navigation` para navegação entre páginas

## Gerenciamento de Estado

O componente gerencia várias variáveis de estado:

- `formData`: Objeto contendo valores de entrada de email e senha
- `isSubmitting`: Flag booleana para rastrear o status de envio do formulário
- `errors`: Objeto para armazenar erros de validação e submissão

## Validação de Formulário

A validação é realizada através do esquema de validação Zod (`loginFormSchema`), que garante:

- Email está em formato válido
- Senha não está vazia

## Fluxo de Autenticação

1. **Entrada do Usuário**: Usuário insere email e senha
2. **Envio do Formulário**: Ao enviar o formulário:
   - Previne o comportamento padrão do formulário
   - Limpa erros anteriores
   - Valida a entrada usando o esquema Zod
3. **Autenticação na API**:
   - Se a validação passar, define `isSubmitting` como verdadeiro
   - Chama `authenticateUser` com email e senha
4. **Gerenciamento de Token**:
   - Em caso de autenticação bem-sucedida, passa o token para `handleAuthentication`
   - Token é armazenado como um cookie com expiração de 7 dias
   - Usuário é redirecionado para a página inicial
5. **Tratamento de Erros**:
   - Erros de validação do formulário são exibidos abaixo dos respectivos campos
   - Erros de autenticação são exibidos como erros em nível de formulário

## Estados de Erro

O componente lida com três tipos de erros:

1. **Erros de validação específicos do campo**: Exibidos abaixo dos respectivos campos de entrada.
2. **Erros de autenticação**: Exibidos como erros em nível de formulário.
3. **Erros inesperados**: Registrados no console e exibidos como erros genéricos de formulário.

## Recursos de UI/UX

- Feedback visual para o estado de envio do formulário (texto do botão muda para "Entrando...")
- Controles de formulário desativados durante o envio para evitar envios múltiplos
- Destaque do campo de entrada para erros de validação
- Mensagens de erro claras para todos os problemas de validação e autenticação
- Método alternativo de login via Google (botão preparado, mas a funcionalidade pode precisar de implementação)
- Link para a página de cadastro para novos usuários

## Exemplo de Uso

```tsx
// Em um componente de página
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <LoginForm />
    </div>
  );
}
```
