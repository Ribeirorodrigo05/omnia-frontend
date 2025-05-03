export const handleAuthentication = (token: string) => {
  if (!token) {
    throw new Error("Authentication failed. No token received.");
  }

  const expires = new Date();
  const expiresDays = 7;
  expires.setDate(expires.getDate() + expiresDays);

  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;

  return;
};
