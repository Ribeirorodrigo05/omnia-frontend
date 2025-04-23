import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleAuthentication = (
  token: string,
  router: AppRouterInstance,
  redirectPath: string = "/home"
) => {
  if (!token) {
    throw new Error("Authentication failed. No token received.");
  }

  // Set token in cookie with 7 days expiration
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

  router.push(redirectPath);
};
