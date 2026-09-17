import { NextResponse } from "next/server";

import { authMiddleware } from "@/middleware/authmiddleware";
import { roleMiddleware } from "@/middleware/rolemiddleware";

export function proxy(request) {
  const path = request.nextUrl.pathname;
  const method = request.method;

  // =========================
  // PUBLIC PROJECT GET
  // =========================

  if (
    path.startsWith("/api/projects") &&
    method === "GET"
  ) {
    return NextResponse.next();
  }

  // =========================
  // AUTHENTICATION
  // =========================

  const user = authMiddleware(request);

  if (user instanceof NextResponse) {
    return user;
  }

  // =========================
  // PROJECT ROUTES
  // =========================

  if (path.startsWith("/api/projects")) {
    // Creating a project = CLIENT ONLY
    if (method === "POST") {
      const roleError = roleMiddleware(user, ["client"]);

      if (roleError) {
        return roleError;
      }
    }

    // Updating/deleting projects
    if (method === "PUT" || method === "DELETE") {
      const roleError = roleMiddleware(user, [
        "client",
        "admin",
      ]);

      if (roleError) {
        return roleError;
      }
    }
  }

  // =========================
  // PROPOSAL ROUTES
  // =========================

  if (path.startsWith("/api/proposals")) {
    if (method === "POST") {
      const roleError = roleMiddleware(user, [
        "freelancer",
      ]);

      if (roleError) {
        return roleError;
      }
    }

    if (method === "PATCH" || method === "PUT") {
      const roleError = roleMiddleware(user, [
        "client",
        "admin",
      ]);

      if (roleError) {
        return roleError;
      }
    }
  }

  // =========================
  // DASHBOARD ROUTES
  // =========================

  if (path.startsWith("/api/dashboard")) {
    if (
      path.startsWith("/api/dashboard/freelancer")
    ) {
      const roleError = roleMiddleware(user, [
        "freelancer",
      ]);

      if (roleError) {
        return roleError;
      }
    } else {
      const roleError = roleMiddleware(user, [
        "client",
      ]);

      if (roleError) {
        return roleError;
      }
    }
  }

  // =========================
  // FORWARD DECODED USER TO ROUTE HANDLERS
  // =========================

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.userId);
  requestHeaders.set("x-user-role", user.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/api/projects/:path*",
    "/api/proposals/:path*",
    "/api/dashboard/:path*",
  ],
};