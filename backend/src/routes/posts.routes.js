import express from "express";
import { prisma } from "../lib/prisma.js";
import { created, fail, ok } from "../lib/api.js";
import { getPagination } from "../lib/pagination.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { uploadImage } from "../lib/upload.js";

const router = express.Router();

function prismaClientMessage(error) {
  if (!error?.code) return null;
  if (error.code === "P2003") {
    return "Invalid user. Please log out and log in again.";
  }
  if (error.code === "P1001") {
    return "Cannot reach database. Check DATABASE_URL and that PostgreSQL is running.";
  }
  if (error.code === "P2021" || error.code === "P2022") {
    return "Database schema is out of sync. Run: npx prisma migrate dev";
  }
  return null;
}

router.get("/", async (req, res) => {
  try {
    const { limit, skip } = getPagination(req);
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: { select: { id: true, username: true, email: true, createdAt: true } },
        },
      }),
      prisma.post.count({ where: { isActive: true } }),
    ]);

    return ok(res, posts, {
      pagination: { total, limit, skip, hasMore: skip + posts.length < total },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/", requireAuth, uploadImage.single("image"), async (req, res) => {
  try {
    const content = String(req.body.content || "").trim();
    if (!content) {
      return fail(res, 400, "Content is required.");
    }
    if (content.length > 280) {
      return fail(res, 400, "Content max length is 280.");
    }

    const userExists = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true },
    });
    if (!userExists) {
      return fail(res, 401, "User not found. Please log in again.");
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const post = await prisma.post.create({
      data: { content, imageUrl, authorId: req.userId },
      include: {
        author: { select: { id: true, username: true, email: true, createdAt: true } },
      },
    });

    return created(res, post);
  } catch (error) {
    console.error("Create post error:", error);
    const hint = prismaClientMessage(error);
    return fail(res, 500, hint || "Internal server error.");
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: { id: req.params.postId, isActive: true },
      include: { author: { select: { id: true, username: true, email: true } } },
    });
    if (!post) return fail(res, 404, "Post not found.");
    return ok(res, post);
  } catch (error) {
    console.error("Get post error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.patch("/:postId", requireAuth, async (req, res) => {
  try {
    const content = String(req.body.content || "").trim();
    if (!content) return fail(res, 400, "Content is required.");
    if (content.length > 280) return fail(res, 400, "Content max length is 280.");

    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });
    if (!post || !post.isActive) return fail(res, 404, "Post not found.");
    if (post.authorId !== req.userId) return fail(res, 403, "You can only edit your own post.");

    const updated = await prisma.post.update({
      where: { id: req.params.postId },
      data: { content },
    });
    return ok(res, updated);
  } catch (error) {
    console.error("Update post error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.delete("/:postId", requireAuth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });
    if (!post || !post.isActive) return fail(res, 404, "Post not found.");
    if (post.authorId !== req.userId) return fail(res, 403, "You can only delete your own post.");

    await prisma.post.update({
      where: { id: req.params.postId },
      data: { isActive: false },
    });
    return ok(res, { deleted: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/:postId/like", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({ where: { id: postId, isActive: true } });
    if (!post) return fail(res, 404, "Post not found.");

    await prisma.$transaction([
      prisma.like.create({
        data: { userId: req.userId, postId },
      }),
      prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } }),
    ]);
    return ok(res, { liked: true });
  } catch (error) {
    if (String(error?.code) === "P2002") return fail(res, 409, "Post already liked.");
    console.error("Like error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.delete("/:postId/like", requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await prisma.post.findFirst({ where: { id: postId, isActive: true } });
    if (!post) return fail(res, 404, "Post not found.");

    const deleted = await prisma.like.deleteMany({
      where: { userId: req.userId, postId },
    });
    if (deleted.count > 0) {
      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      });
    }
    return ok(res, { liked: false });
  } catch (error) {
    console.error("Unlike error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await prisma.post.findFirst({ where: { id: req.params.postId, isActive: true } });
    if (!post) return fail(res, 404, "Post not found.");

    const comments = await prisma.comment.findMany({
      where: { postId: req.params.postId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, username: true, email: true, createdAt: true } } },
    });
    return ok(res, comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.post("/:postId/comments", requireAuth, async (req, res) => {
  try {
    const post = await prisma.post.findFirst({ where: { id: req.params.postId, isActive: true } });
    if (!post) return fail(res, 404, "Post not found.");

    const content = String(req.body.content || "").trim();
    if (!content) {
      return fail(res, 400, "Comment content is required.");
    }
    if (content.length > 280) {
      return fail(res, 400, "Comment max length is 280.");
    }

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { content, userId: req.userId, postId: req.params.postId },
        include: { user: { select: { id: true, username: true, email: true, createdAt: true } } },
      }),
      prisma.post.update({
        where: { id: req.params.postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);
    return created(res, comment);
  } catch (error) {
    console.error("Create comment error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

router.delete("/:postId/comments/:commentId", requireAuth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.commentId },
    });
    if (!comment || comment.postId !== req.params.postId) {
      return fail(res, 404, "Comment not found.");
    }
    if (comment.userId !== req.userId) {
      return fail(res, 403, "You can only delete your own comment.");
    }

    await prisma.comment.delete({ where: { id: req.params.commentId } });
    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });
    if (post && post.commentCount > 0) {
      await prisma.post.update({
        where: { id: req.params.postId },
        data: { commentCount: { decrement: 1 } },
      });
    }
    return ok(res, { deleted: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return fail(res, 500, "Internal server error.");
  }
});

export default router;
