import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Always resolves to backend/uploads (works no matter where node was started from). */
export const uploadsDir = path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

function imageFileFilter(_req, file, cb) {
  const mimeOk = ["image/jpeg", "image/png"].includes(file.mimetype);
  const extOk = /\.(jpe?g|png)$/i.test(file.originalname || "");
  if (mimeOk || extOk) {
    return cb(null, true);
  }
  return cb(new Error("Only JPEG and PNG images are allowed."));
}

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "") || ".png";
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});
