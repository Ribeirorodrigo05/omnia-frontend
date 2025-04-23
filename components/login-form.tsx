"use client";

import { cn } from "@/lib/utils";
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
import { loginFormSchema } from "@/lib/inputs-validation";
import { authenticateUser } from "@/app/api/repositories/auth";
import { useRouter } from "next/navigation";

import Logo from "@/public/omnia.png";

import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const result = loginFormSchema.safeParse(formData);

      if (result.success) {
        setIsSubmitting(true);
        try {
          const response = await authenticateUser(
            formData.email,
            formData.password
          );

          if (!response.token) {
            throw new Error("Authentication failed. No token received.");
          }

          const expires = new Date();
          expires.setDate(expires.getDate() + 7);

          document.cookie = `auth_token=${
            response.token
          }; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

          router.push("/home");
        } catch (error) {
          console.error("Failed to login:", error);
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : "Failed to login. Please check your credentials and try again.",
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        const formattedErrors = result.error.errors.reduce(
          (acc: Record<string, string>, curr) => {
            if (curr.path[0]) {
              acc[curr.path[0] as string] = curr.message;
            }
            return acc;
          },
          {}
        );
        setErrors(formattedErrors);
      }
    } catch (error) {
      setErrors({ form: "An unexpected error occurred" });
      console.error("Form validation error:", error);
    }
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
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
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
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
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
