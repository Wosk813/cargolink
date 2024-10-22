import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";

export class AuthError extends Error {
  type: string;

  constructor(type: string, message: string) {
    super(message);
    this.type = type;
    this.name = "AuthError";
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new AuthError("CredentialsSignin", "Email and password are required");
  }

  try {
    const user = await sql`
            SELECT id, email, password_hash 
            FROM users 
            WHERE email = ${email}
        `;

    if (user.rows.length === 0) {
      throw new AuthError("CredentialsSignin", "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!isValidPassword) {
      throw new AuthError("CredentialsSignin", "Invalid credentials");
    }

    return {
      id: user.rows[0].id,
      email: user.rows[0].email,
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new AuthError("DatabaseError", "Something went wrong");
  }
}
