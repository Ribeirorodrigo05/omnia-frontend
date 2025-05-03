"use client";

import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/app/api/repositories/user";
import Logo from "@/public/omnia.png";
import Image from "next/image";
import { useState } from "react";
import { registerFormSchema } from "@/app/lib/inputs-validation";
import { authenticateUser } from "@/app/api/repositories/auth";
import { useRouter } from "next/navigation";
import { handleAuthentication } from "@/app/lib/auth-utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
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
      const result = registerFormSchema.safeParse(formData);

      if (result.success) {
        setIsSubmitting(true);
        try {
          const response = await createUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            status: "active",
          });

          if (!response.success) {
            throw new Error(response.message || "Failed to create user");
          }

          const { token } = await authenticateUser(
            formData.email,
            formData.password
          );

          try {
            handleAuthentication(token, router);
          } catch (error) {
            console.error("Authentication error:", error);
            setErrors({
              form:
                error instanceof Error
                  ? error.message
                  : "Failed to authenticate. Please try again.",
            });
          }
        } catch (error) {
          console.error("Failed to register user:", error);
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : "Failed to register. Please try again.",
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
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
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
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              {errors.form && (
                <p className="text-red-500 text-sm text-center">
                  {errors.form}
                </p>
              )}{" "}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
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
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
