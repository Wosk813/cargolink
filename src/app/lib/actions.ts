"use server";

import { signIn } from "./auth";
import { AuthError } from "./auth";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await signIn(formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
