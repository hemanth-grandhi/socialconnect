import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_BUCKET || "avatars";

export async function uploadAvatar(file) {
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const filePath = `avatars/${Date.now()}-${file.originalname}`;
    const fileBuffer = await fs.readFile(file.path);
    const { error } = await supabase.storage.from(bucket).upload(filePath, fileBuffer, {
      contentType: file.mimetype,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Fallback for local development when Supabase env is not set.
  return `/uploads/${path.basename(file.path)}`;
}
