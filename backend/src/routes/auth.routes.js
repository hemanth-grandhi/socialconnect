import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/auth.js";
import { created, fail, ok } from "../lib/api.js";

const router = express.Router();
const usernameRegex = /^[A-Za-z0-9_]{3,30}$/;

async function registerHandler(req, res) {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    if (!email || !username || !password || !firstName || !lastName) {
      return fail(res, 400, "email, username, password, firstName, lastName are required.");
    }
    if (!usernameRegex.test(username)) {
      return fail(res, 400, "Username must be 3-30 chars: letters, numbers, underscore.");
    }
    if (password.length < 8) {
      return fail(res, 400, "Password must be at least 8 characters long.");
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existingUser) {
      return fail(res, 409, "Email or username is already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return created(res, user);
  } catch (error) {
    console.error("Signup error for user:", username || email, error);
    return fail(res, 500, "Internal server error.");
  }
}

router.post("/register", registerHandler);

router.post("/login", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!password || (!email && !username)) {
      return fail(res, 400, "Provide password and either email or username.");
    }

    const user = await prisma.user.findFirst({
      where: email ? { email } : { username },
    });
    if (!user) {
      return fail(res, 401, "Invalid credentials.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return fail(res, 401, "Invalid credentials.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken(user.id);
    return ok(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error for user:", email || username, error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/logout", (_req, res) => ok(res, { message: "Logged out." }));

export default router;
