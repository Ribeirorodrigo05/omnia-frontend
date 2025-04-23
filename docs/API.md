# API

Esta página documenta as APIs disponíveis no projeto Omnia Frontend.

## Autenticação

### `auth.ts`

Este módulo contém as funções de autenticação:

- **login**: Realiza o login do usuário
- **register**: Registra um novo usuário
- **logout**: Encerra a sessão do usuário

### `user.ts`

Este módulo gerencia as operações relacionadas ao usuário:

- **getUserProfile**: Obtém o perfil do usuário atual
- **updateUserProfile**: Atualiza as informações do perfil do usuário

## Utilitários

### `auth-utils.ts`

Contém utilidades para gerenciar a autenticação:

- **isAuthenticated**: Verifica se o usuário está autenticado
- **getAuthToken**: Recupera o token de autenticação do armazenamento
- **setAuthToken**: Armazena o token de autenticação

### `inputs-validation.ts`

Contém funções para validar campos de formulário:

- **validateEmail**: Valida se o email está em formato correto
- **validatePassword**: Verifica se a senha atende aos requisitos de segurança
- **validateUsername**: Verifica se o nome de usuário é válido

### `utils.ts`

Contém funções utilitárias gerais:

- **formatDate**: Formata datas para exibição
- **debounce**: Limita a frequência de execução de funções
