import { z } from "zod";

export function emailSchema() {
  return z.string().email("Email inválido");
}

export function passwordSchema() {
  return z
    .string()
    .min(6, "A senha deve conter pelo menos 6 caracteres")
    .refine(
      (password) => /[^a-zA-Z0-9]/.test(password),
      "A senha deve conter pelo menos um caractere especial"
    );
}

export function nameSchema() {
  return z.string().min(3, "O nome deve conter pelo menos 3 caracteres").trim();
}

export function passwordConfirmationSchema(password: string) {
  return z
    .string()
    .min(1, "Confirmação de senha é obrigatória")
    .refine((confirmation) => confirmation === password, {
      message: "As senhas não coincidem",
    });
}

export function isValidEmail(email: string): boolean {
  return emailSchema().safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
  return passwordSchema().safeParse(password).success;
}

export function isValidName(name: string): boolean {
  return nameSchema().safeParse(name).success;
}

export function isValidPasswordConfirmation(
  confirmation: string,
  password: string
): boolean {
  return passwordConfirmationSchema(password).safeParse(confirmation).success;
}

export function getValidationError<T>(
  schema: z.ZodType<T>,
  value: unknown
): string | null {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Erro de validação";
    }
    return "Erro de validação";
  }
}

export const loginFormSchema = z.object({
  email: emailSchema(),
  password: passwordSchema(),
});

export const registerFormSchema = z
  .object({
    name: nameSchema(),
    email: emailSchema(),
    password: passwordSchema(),
  })
  .refine(
    (data) => {
      return data.password === data.password;
    },
    {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    }
  );

export type LoginFormData = z.infer<typeof loginFormSchema>;

export type RegisterFormData = z.infer<typeof registerFormSchema>;
