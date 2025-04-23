export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export function getAuthToken(): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }

  return undefined;
}

export async function fetchData(
  endpoint: string,
  data: object | object[] | string | boolean,
  method: string
) {
  try {
    const token = getAuthToken();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}
