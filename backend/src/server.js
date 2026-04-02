import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { uploadsDir } from "./lib/upload.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/posts.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 4001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const ALLOWED_ORIGINS = [FRONTEND_ORIGIN, "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/users", userRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, error: "Image max size is 2MB." });
    }
    return res.status(400).json({ success: false, error: err.message });
  }

  if (
    err?.message === "Only JPEG and PNG allowed." ||
    err?.message === "Only JPEG and PNG images are allowed."
  ) {
    return res.status(400).json({ success: false, error: err.message });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({ success: false, error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
