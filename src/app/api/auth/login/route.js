import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loginUser } from "@/services/authservice";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    const result = await loginUser(email, password);

    return NextResponse.json(
      {
        status: "Login successful",
        token: result.token,
        user: result.user,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      {
        status: "Login failed",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}