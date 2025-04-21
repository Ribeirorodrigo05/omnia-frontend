import { fetchData } from "../fetchprovider";

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  status: string;
}) {
  try {
    const response = await fetchData("/user/create", userData, "POST");

    if (response?.message !== "ok") {
      throw new Error(response?.message || "Failed to create user");
    }

    return {
      success: true,
      message: "User created successfully", // Return user data if available
    };
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}
