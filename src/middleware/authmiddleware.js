import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const authMiddleware = (request) => {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization token is required",
        },
        { status: 401 }
      );
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authorization format",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return {
      userId: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
};