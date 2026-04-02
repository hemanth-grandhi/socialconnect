import express from "express";
import { prisma } from "../lib/prisma.js";
import { fail, ok } from "../lib/api.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadAvatar } from "../lib/storage.js";
import { uploadImage } from "../lib/upload.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });
    return ok(res, users);
  } catch (error) {
    console.error("List users error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatarUrl: true,
        website: true,
        location: true,
        createdAt: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });

    if (!user) return fail(res, 404, "User not found.");
    return ok(res, user);
  } catch (error) {
    console.error("Get profile error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { bio, avatar_url, website, location, first_name, last_name } = req.body;
    if (bio && String(bio).length > 160) {
      return fail(res, 400, "bio max length is 160.");
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(bio !== undefined ? { bio: String(bio) } : {}),
        ...(avatar_url !== undefined ? { avatarUrl: String(avatar_url) } : {}),
        ...(website !== undefined ? { website: String(website) } : {}),
        ...(location !== undefined ? { location: String(location) } : {}),
        ...(first_name !== undefined ? { firstName: String(first_name) } : {}),
        ...(last_name !== undefined ? { lastName: String(last_name) } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatarUrl: true,
        website: true,
        location: true,
      },
    });

    return ok(res, updated);
  } catch (error) {
    console.error("Update me error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/me/avatar", requireAuth, uploadImage.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return fail(res, 400, "avatar file is required.");
    const avatarUrl = await uploadAvatar(req.file);
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { avatarUrl },
      select: { id: true, username: true, avatarUrl: true },
    });
    return ok(res, user);
  } catch (error) {
    console.error("Upload avatar error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/:userId/follow", requireAuth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    if (req.userId === targetUserId) return fail(res, 400, "You cannot follow yourself.");

    await prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId: req.userId, followingId: targetUserId },
      },
      create: { followerId: req.userId, followingId: targetUserId },
      update: {},
    });

    return ok(res, { following: true });
  } catch (error) {
    console.error("Follow error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.delete("/:userId/follow", requireAuth, async (req, res) => {
  try {
    await prisma.follow.deleteMany({
      where: { followerId: req.userId, followingId: req.params.userId },
    });
    return ok(res, { following: false });
  } catch (error) {
    console.error("Unfollow error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.get("/:userId/followers", async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: req.params.userId },
      include: {
        follower: {
          select: { id: true, username: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });
    return ok(res, followers.map((f) => f.follower));
  } catch (error) {
    console.error("Get followers error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.get("/:userId/following", async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: req.params.userId },
      include: {
        following: {
          select: { id: true, username: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });
    return ok(res, following.map((f) => f.following));
  } catch (error) {
    console.error("Get following error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

export default router;
