import { fail } from "../lib/api.js";
import { verifyToken } from "../lib/auth.js";

/**
 * Middleware to require authentication for protected routes
 * Validates JWT token from Authorization header
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return fail(res, 401, "Unauthorized.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return fail(res, 401, "Unauthorized.");
  }

  const payload = verifyToken(token);
  if (!payload?.userId) {
    return fail(res, 401, "Unauthorized.");
  }

  req.userId = payload.userId;
  next();
}
