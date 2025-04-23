# Componentes

Esta página documenta os componentes disponíveis no projeto Omnia Frontend.

## Componentes de Autenticação

### LoginForm

O componente `LoginForm` gerencia o processo de autenticação do usuário.

```tsx
// Exemplo de uso:
<LoginForm />
```

### RegisterForm

O componente `RegisterForm` permite que novos usuários se cadastrem na plataforma.

```tsx
// Exemplo de uso:
<RegisterForm />
```

## Componentes UI

### Button

Componente de botão customizável que segue o design system do projeto.

```tsx
// Exemplo de uso:
<Button variant="default">Click me</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
```

### Card

Componente de card utilizado para agrupar conteúdo relacionado.

```tsx
// Exemplo de uso:
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo do card</CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Input

Componente de entrada de texto.

```tsx
// Exemplo de uso:
<Input placeholder="Digite aqui..." />
```

### Label

Componente de label para usar com campos de formulário.

```tsx
// Exemplo de uso:
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```
