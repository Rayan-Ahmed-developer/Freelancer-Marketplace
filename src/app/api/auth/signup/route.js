import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { registerUser } from "@/services/authservice";

export async function POST(request) {
  try {
    await connectDB();

    const userData = await request.json();

    const user = await registerUser(userData);

    // Convert Mongoose document into normal object
    const userObject = user.toObject ? user.toObject() : user;

    // Never send password back to frontend
    const { password, __v, ...safeUser } = userObject;

    return NextResponse.json(
      {
        status: "User registered successfully",
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        status: "User registration failed",
        error: error.message,
      },
      { status: 400 }
    );
  }
}