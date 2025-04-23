import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
