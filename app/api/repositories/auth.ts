import { fetchData } from "../fetchprovider";

export async function authenticateUser(email: string, password: string) {
  const endpoint = "/authentication/login";

  const response = await fetchData(endpoint, { email, password }, "POST");

  return response;
}
