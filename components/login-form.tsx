"use client";

import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { loginFormSchema, LoginFormData } from "@/app/lib/inputs-validation";
import { authenticateUser } from "@/app/api/repositories/auth";
import { useRouter } from "next/navigation";
import { handleAuthentication } from "@/app/lib/auth-utils";
import { ZodError } from "zod";

import Logo from "@/public/omnia.png";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { setUserAtom } from "@/atoms/user";
import { useAtom } from "jotai";

function formatValidationErrors(
  error: ZodError<LoginFormData>
): Record<string, string> {
  return error.errors.reduce((acc: Record<string, string>, curr) => {
    const path = curr.path[0];
    if (path) {
      acc[path.toString()] = curr.message;
    }
    return acc;
  }, {});
}

function setFormError(
  error: unknown,
  setErrorsState: React.Dispatch<
    React.SetStateAction<Partial<LoginFormData> & { form?: string }>
  >,
  contextMessage: string
): void {
  console.error(contextMessage, error);
  const message = error instanceof Error ? error.message : contextMessage;
  setErrorsState({ form: message });
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [, setUser] = useAtom(setUserAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<LoginFormData> & { form?: string }
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id as keyof typeof errors];

        if (!Object.keys(newErrors).some((key) => key !== "form")) {
          delete newErrors.form;
        }
        return newErrors;
      });
    }
  };

  const performLogin = async () => {
    try {
      const { token } = await authenticateUser(
        formData.email,
        formData.password
      );

      await Promise.all([
        handleAuthentication(token),
        saveUserDataInGlobalState(token),
      ]);

      router.push("/home");
    } catch (error) {
      setFormError(
        error,
        setErrors,
        "Falha no processo de login ou autenticação."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validationResult = loginFormSchema.safeParse(formData);

    if (!validationResult.success) {
      setErrors(formatValidationErrors(validationResult.error));
      return;
    }

    setIsSubmitting(true);
    try {
      await performLogin();
    } catch (error) {
      setFormError(error, setErrors, "Erro inesperado durante a submissão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveUserDataInGlobalState = (token: string) => {
    const userData: { id: string; role: string } = jwtDecode(token);
    if (!userData)
      setErrors({ form: "Failed to decode user data from token." });

    setUser({ id: userData.id, role: userData.role });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center">
            <Image
              src={Logo}
              alt="Logo"
              width={180}
              height={120}
              className="mb-4"
            />
          </div>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                {errors.password && (
                  <p id="password-error" className="text-red-500 text-sm">
                    {errors.password}
                  </p>
                )}
              </div>

              {errors.form && (
                <p className="text-red-500 text-sm text-center">
                  {errors.form}
                </p>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  disabled={isSubmitting}
                >
                  Login with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
