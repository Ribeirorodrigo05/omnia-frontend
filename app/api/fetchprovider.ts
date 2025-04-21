export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

export async function fetchData(
  endpoint: string,
  data: object | object[] | string | boolean,
  method: string
) {
  try {
    console.log("Fetching data from:", `${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}
