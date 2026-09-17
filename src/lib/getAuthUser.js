// lib/getAuthUser.js
export function getAuthUser(request) {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId) {
        return null;
    }

    return {
        userId,
        role: userRole,
    };
}