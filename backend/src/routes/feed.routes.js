import express from "express";
import { prisma } from "../lib/prisma.js";
import { fail, ok } from "../lib/api.js";
import { getPagination } from "../lib/pagination.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { limit, skip } = getPagination(req);
    const follows = await prisma.follow.findMany({
      where: { followerId: req.userId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);
    const where =
      followingIds.length > 0
        ? { authorId: { in: followingIds }, isActive: true }
        : { isActive: true };

    const [feedPosts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, username: true, email: true, createdAt: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return ok(res, feedPosts, {
      pagination: { total, limit, skip, hasMore: skip + feedPosts.length < total },
    });
  } catch (error) {
    console.error("Feed error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

export default router;
