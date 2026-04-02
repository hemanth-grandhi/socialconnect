import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

/**
 * Signs a JWT token for user authentication
 * @param userId - The user ID to include in the token
 * @returns The signed JWT token
 */
export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
