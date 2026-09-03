import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Extracts + verifies the user from the "token" cookie on a Request object
export function getUserFromRequest(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token); // { id, email, role, iat, exp } or null
}

export function requireAuth(req) {
  const user = getUserFromRequest(req);
  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }
  return { user };
}

export function requireAdmin(req) {
  const user = getUserFromRequest(req);
  if (!user) return { error: "Unauthorized", status: 401 };
  if (user.role !== "admin") return { error: "Forbidden", status: 403 };
  return { user };
}
